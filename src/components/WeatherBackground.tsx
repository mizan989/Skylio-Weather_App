import { useEffect, useRef } from 'react';
import type { ConditionFamily } from '../lib/weatherCodes';

interface Props {
  family: ConditionFamily;
  isDay: boolean;
}

/* ─── helpers ─── */
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgba(c: [number, number, number], a: number): string {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

/* ─── palette ─── */
interface SkyPalette {
  top: [number, number, number];
  bottom: [number, number, number];
  sun: [number, number, number];
  cloud: [number, number, number];
  haze: [number, number, number];
  rain: [number, number, number];
}

function getPalette(family: ConditionFamily, isDay: boolean): SkyPalette {
  if (isDay) {
    switch (family) {
      case 'clear':
        return {
          top: hexToRgb('#1E5AAF'), bottom: hexToRgb('#78B5E8'),
          sun: hexToRgb('#FFF0C0'), cloud: hexToRgb('#FFFFFF'),
          haze: hexToRgb('#B0D0F0'), rain: hexToRgb('#8AACC6'),
        };
      case 'cloudy':
        return {
          top: hexToRgb('#4A6078'), bottom: hexToRgb('#8A9CAE'),
          sun: hexToRgb('#E8D8B0'), cloud: hexToRgb('#D8DDE4'),
          haze: hexToRgb('#A0AAB6'), rain: hexToRgb('#8898A8'),
        };
      case 'fog':
        return {
          top: hexToRgb('#6A7580'), bottom: hexToRgb('#A0A8B0'),
          sun: hexToRgb('#D8CCA0'), cloud: hexToRgb('#C8CDD4'),
          haze: hexToRgb('#B0B6BE'), rain: hexToRgb('#9098A0'),
        };
      case 'rain':
        return {
          top: hexToRgb('#283848'), bottom: hexToRgb('#506878'),
          sun: hexToRgb('#A0B0C0'), cloud: hexToRgb('#8898A8'),
          haze: hexToRgb('#607080'), rain: hexToRgb('#B0C8DA'),
        };
      case 'snow':
        return {
          top: hexToRgb('#5878A0'), bottom: hexToRgb('#AAC0D8'),
          sun: hexToRgb('#E0E8F0'), cloud: hexToRgb('#E8EEF4'),
          haze: hexToRgb('#C0D0E0'), rain: hexToRgb('#D0DAE4'),
        };
      case 'storm':
        return {
          top: hexToRgb('#181C28'), bottom: hexToRgb('#2A3040'),
          sun: hexToRgb('#606878'), cloud: hexToRgb('#505868'),
          haze: hexToRgb('#383E4C'), rain: hexToRgb('#90A0B8'),
        };
    }
  } else {
    switch (family) {
      case 'clear':
        return {
          top: hexToRgb('#050A18'), bottom: hexToRgb('#0E1A30'),
          sun: hexToRgb('#C8D0E0'), cloud: hexToRgb('#384868'),
          haze: hexToRgb('#0A1020'), rain: hexToRgb('#506080'),
        };
      case 'cloudy':
        return {
          top: hexToRgb('#080C18'), bottom: hexToRgb('#181E2C'),
          sun: hexToRgb('#8090A8'), cloud: hexToRgb('#2A3040'),
          haze: hexToRgb('#101820'), rain: hexToRgb('#405060'),
        };
      case 'fog':
        return {
          top: hexToRgb('#0A0E18'), bottom: hexToRgb('#1C2028'),
          sun: hexToRgb('#707880'), cloud: hexToRgb('#282E38'),
          haze: hexToRgb('#181C24'), rain: hexToRgb('#404850'),
        };
      case 'rain':
        return {
          top: hexToRgb('#040810'), bottom: hexToRgb('#101820'),
          sun: hexToRgb('#506070'), cloud: hexToRgb('#1C2430'),
          haze: hexToRgb('#081018'), rain: hexToRgb('#607890'),
        };
      case 'snow':
        return {
          top: hexToRgb('#080E1C'), bottom: hexToRgb('#1A2838'),
          sun: hexToRgb('#A0B0C8'), cloud: hexToRgb('#2C3848'),
          haze: hexToRgb('#101820'), rain: hexToRgb('#8098B0'),
        };
      case 'storm':
        return {
          top: hexToRgb('#020408'), bottom: hexToRgb('#0C0E18'),
          sun: hexToRgb('#303840'), cloud: hexToRgb('#181C28'),
          haze: hexToRgb('#060810'), rain: hexToRgb('#4060A0'),
        };
    }
  }
}

/* ─── particle types ─── */
interface CloudLayer {
  x: number; y: number;
  w: number; h: number;
  speed: number;
  opacity: number;
  depth: number; // 0=far, 1=near
  seed: number;
}

interface RainDrop {
  x: number; y: number;
  len: number; speed: number;
  opacity: number;
  windOffset: number;
  layer: number; // 0=bg, 1=mid, 2=fg
}

interface Star {
  x: number; y: number;
  r: number;
  brightness: number;
  phase: number;
  twinkleSpeed: number;
}

interface SnowFlake {
  x: number; y: number;
  r: number; speed: number;
  drift: number; phase: number;
  opacity: number;
}

interface LightningBolt {
  segments: Array<{ x1: number; y1: number; x2: number; y2: number; width: number }>;
  startTime: number;
  duration: number;
  brightness: number;
  originX: number;
  originY: number;
}

/* ─── lightning bolt generation ─── */
function generateBolt(
  x: number, y: number,
  angle: number, length: number,
  segments: LightningBolt['segments'],
  depth: number,
  maxDepth: number,
): void {
  if (depth > maxDepth || length < 4) return;

  const steps = Math.max(3, Math.floor(length / rand(12, 25)));
  let cx = x, cy = y;

  for (let i = 0; i < steps; i++) {
    const frac = (i + 1) / steps;
    const jitter = rand(-length * 0.08, length * 0.08) * (1 - depth * 0.15);
    const stepLen = (length / steps);
    const nx = cx + Math.cos(angle) * stepLen + jitter;
    const ny = cy + Math.sin(angle) * stepLen;
    const w = lerp(2.5, 0.5, depth / maxDepth) * lerp(1, 0.3, frac);

    segments.push({ x1: cx, y1: cy, x2: nx, y2: ny, width: Math.max(0.4, w) });
    cx = nx;
    cy = ny;

    // branch
    if (depth < maxDepth && Math.random() < 0.3 * (1 - depth * 0.3)) {
      const branchAngle = angle + rand(-0.8, 0.8);
      const branchLen = length * rand(0.2, 0.45) * (1 - frac * 0.5);
      generateBolt(cx, cy, branchAngle, branchLen, segments, depth + 1, maxDepth);
    }
  }
}

function createBolt(w: number, h: number): LightningBolt {
  const originX = rand(w * 0.15, w * 0.85);
  const originY = rand(h * 0.02, h * 0.12);
  const angle = rand(Math.PI * 0.38, Math.PI * 0.62); // roughly downward
  const length = rand(h * 0.25, h * 0.55);
  const segments: LightningBolt['segments'] = [];
  generateBolt(originX, originY, angle, length, segments, 0, 4);

  return {
    segments,
    startTime: 0,
    duration: rand(250, 450),
    brightness: rand(0.7, 1.0),
    originX,
    originY,
  };
}

/* ─── main component ─── */
export default function WeatherBackground({ family, isDay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    // Particle pools
    let clouds: CloudLayer[] = [];
    let rainDrops: RainDrop[] = [];
    let stars: Star[] = [];
    let snowFlakes: SnowFlake[] = [];

    // Lightning state
    let activeBolts: LightningBolt[] = [];
    let nextLightningTime = performance.now() + rand(4000, 10000);
    let ambientFlash = 0;

    // Palette transition
    let currentPalette = getPalette(family, isDay);
    let targetPalette = currentPalette;
    let paletteT = 1;

    function blendedPalette(): SkyPalette {
      const t = clamp(paletteT, 0, 1);
      return {
        top: lerpColor(currentPalette.top, targetPalette.top, t),
        bottom: lerpColor(currentPalette.bottom, targetPalette.bottom, t),
        sun: lerpColor(currentPalette.sun, targetPalette.sun, t),
        cloud: lerpColor(currentPalette.cloud, targetPalette.cloud, t),
        haze: lerpColor(currentPalette.haze, targetPalette.haze, t),
        rain: lerpColor(currentPalette.rain, targetPalette.rain, t),
      };
    }

    // Determine which features are active
    const showSun = isDay && (family === 'clear' || family === 'cloudy');
    const showMoon = !isDay;
    const showStars = !isDay;
    const showClouds = family === 'cloudy' || family === 'rain' || family === 'storm' || family === 'fog';
    const showPartialClouds = family === 'clear' && isDay; // subtle wispy clouds even for clear
    const showRain = family === 'rain' || family === 'storm';
    const showSnow = family === 'snow';
    const showLightning = family === 'storm';
    const showHaze = family === 'rain' || family === 'storm' || family === 'fog' || family === 'snow';

    function initParticles() {
      const density = clamp(W / 1400, 0.5, 1.5);

      // --- Clouds ---
      clouds = [];
      if (showClouds) {
        const count = family === 'storm' ? 12 : family === 'rain' ? 10 : family === 'fog' ? 8 : 8;
        for (let i = 0; i < Math.round(count * density); i++) {
          const depth = rand(0, 1);
          clouds.push({
            x: rand(-400, W + 400),
            y: rand(H * 0.01, H * 0.45) * lerp(0.6, 1.2, depth),
            w: rand(300, 700) * lerp(0.6, 1.4, depth),
            h: rand(60, 180) * lerp(0.5, 1.1, depth),
            speed: lerp(0.03, 0.18, depth),
            opacity: lerp(0.04, 0.22, 1 - depth * 0.4) * (family === 'storm' ? 1.4 : 1),
            depth,
            seed: rand(0, 1000),
          });
        }
        clouds.sort((a, b) => a.depth - b.depth); // far first
      } else if (showPartialClouds) {
        // A few wispy clouds for clear day
        for (let i = 0; i < Math.round(3 * density); i++) {
          const depth = rand(0.1, 0.5);
          clouds.push({
            x: rand(-200, W + 200),
            y: rand(H * 0.05, H * 0.25),
            w: rand(250, 500),
            h: rand(40, 80),
            speed: lerp(0.02, 0.06, depth),
            opacity: rand(0.04, 0.09),
            depth,
            seed: rand(0, 1000),
          });
        }
      }

      // --- Night clouds ---
      if (!isDay && family !== 'clear') {
        for (let i = 0; i < Math.round(4 * density); i++) {
          const depth = rand(0.2, 0.8);
          clouds.push({
            x: rand(-300, W + 300),
            y: rand(H * 0.05, H * 0.35),
            w: rand(250, 550),
            h: rand(50, 120),
            speed: lerp(0.02, 0.08, depth),
            opacity: rand(0.06, 0.14),
            depth,
            seed: rand(0, 1000),
          });
        }
      }

      // --- Rain ---
      rainDrops = [];
      if (showRain) {
        const total = Math.round((family === 'storm' ? 200 : 140) * density);
        for (let i = 0; i < total; i++) {
          const layer = i < total * 0.3 ? 0 : i < total * 0.7 ? 1 : 2;
          const layerScale = [0.5, 0.8, 1.2][layer];
          rainDrops.push({
            x: rand(-50, W + 50),
            y: rand(-H * 0.1, H),
            len: rand(8, 18) * layerScale,
            speed: rand(10, 18) * layerScale,
            opacity: [rand(0.06, 0.12), rand(0.1, 0.22), rand(0.18, 0.35)][layer],
            windOffset: rand(-0.12, -0.06),
            layer,
          });
        }
      }

      // --- Snow ---
      snowFlakes = [];
      if (showSnow) {
        const count = Math.round(100 * density);
        for (let i = 0; i < count; i++) {
          snowFlakes.push({
            x: rand(0, W), y: rand(-20, H),
            r: rand(1, 4), speed: rand(0.4, 1.6),
            drift: rand(0.3, 1.0), phase: rand(0, Math.PI * 2),
            opacity: rand(0.4, 0.85),
          });
        }
      }

      // --- Stars ---
      stars = [];
      if (showStars) {
        const count = Math.round(80 * density);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: rand(0, W), y: rand(0, H * 0.6),
            r: rand(0.3, 1.4),
            brightness: rand(0.3, 0.9),
            phase: rand(0, Math.PI * 2),
            twinkleSpeed: rand(0.0005, 0.0025),
          });
        }
      }

      // Reset lightning
      activeBolts = [];
      nextLightningTime = performance.now() + rand(4000, 10000);
      ambientFlash = 0;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    /* ─────── draw functions ─────── */

    function drawSkyGradient(pal: SkyPalette) {
      const grad = ctx!.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, rgba(pal.top, 1));
      grad.addColorStop(1, rgba(pal.bottom, 1));
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
    }

    function drawSun(pal: SkyPalette, t: number) {
      const sx = W * 0.78;
      const sy = H * 0.13;
      ctx!.save();

      // Very large atmospheric glow
      const pulse = 0.96 + 0.04 * Math.sin(t * 0.0003);
      const outerR = 220 * pulse;
      const g1 = ctx!.createRadialGradient(sx, sy, 0, sx, sy, outerR);
      g1.addColorStop(0, rgba(pal.sun, 0.18));
      g1.addColorStop(0.3, rgba(pal.sun, 0.08));
      g1.addColorStop(0.6, rgba(pal.sun, 0.03));
      g1.addColorStop(1, rgba(pal.sun, 0));
      ctx!.fillStyle = g1;
      ctx!.fillRect(sx - outerR, sy - outerR, outerR * 2, outerR * 2);

      // Medium warm glow
      const midR = 90 * pulse;
      const g2 = ctx!.createRadialGradient(sx, sy, 0, sx, sy, midR);
      g2.addColorStop(0, rgba(pal.sun, 0.35));
      g2.addColorStop(0.5, rgba(pal.sun, 0.12));
      g2.addColorStop(1, rgba(pal.sun, 0));
      ctx!.fillStyle = g2;
      ctx!.beginPath();
      ctx!.arc(sx, sy, midR, 0, Math.PI * 2);
      ctx!.fill();

      // Soft core
      const coreR = 28;
      const g3 = ctx!.createRadialGradient(sx, sy, 0, sx, sy, coreR);
      g3.addColorStop(0, rgba([255, 252, 240], 0.92));
      g3.addColorStop(0.6, rgba(pal.sun, 0.6));
      g3.addColorStop(1, rgba(pal.sun, 0));
      ctx!.fillStyle = g3;
      ctx!.beginPath();
      ctx!.arc(sx, sy, coreR, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
    }

    function drawMoon(_pal: SkyPalette, t: number) {
      const mx = W * 0.8;
      const my = H * 0.14;
      ctx!.save();

      // Wide outer corona
      const pulse = 0.97 + 0.03 * Math.sin(t * 0.0004);
      const coronaR = 100 * pulse;
      const g1 = ctx!.createRadialGradient(mx, my, 0, mx, my, coronaR);
      g1.addColorStop(0, 'rgba(200,210,230,0.14)');
      g1.addColorStop(0.5, 'rgba(180,195,220,0.05)');
      g1.addColorStop(1, 'rgba(160,175,200,0)');
      ctx!.fillStyle = g1;
      ctx!.beginPath();
      ctx!.arc(mx, my, coronaR, 0, Math.PI * 2);
      ctx!.fill();

      // Inner glow
      const innerR = 40;
      const g2 = ctx!.createRadialGradient(mx, my, 0, mx, my, innerR);
      g2.addColorStop(0, 'rgba(220,228,240,0.6)');
      g2.addColorStop(0.5, 'rgba(200,210,225,0.2)');
      g2.addColorStop(1, 'rgba(180,190,210,0)');
      ctx!.fillStyle = g2;
      ctx!.beginPath();
      ctx!.arc(mx, my, innerR, 0, Math.PI * 2);
      ctx!.fill();

      // Moon disc
      const moonR = 16;
      const g3 = ctx!.createRadialGradient(mx - 3, my - 2, 0, mx, my, moonR);
      g3.addColorStop(0, 'rgba(238,242,250,0.95)');
      g3.addColorStop(0.8, 'rgba(215,222,235,0.88)');
      g3.addColorStop(1, 'rgba(195,205,220,0.7)');
      ctx!.fillStyle = g3;
      ctx!.beginPath();
      ctx!.arc(mx, my, moonR, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
    }

    function drawStars(t: number) {
      ctx!.save();
      for (const s of stars) {
        const twinkle = s.brightness * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));
        ctx!.globalAlpha = clamp(twinkle, 0.05, 0.85);
        ctx!.fillStyle = '#E8EEF8';
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawCloud(c: CloudLayer, pal: SkyPalette) {
      ctx!.save();
      ctx!.globalAlpha = c.opacity;

      // Build organic cloud shape with multiple ellipses
      const cx = c.x;
      const cy = c.y;
      const hw = c.w * 0.5;
      const hh = c.h * 0.5;

      // Use seed-based offsets for unique cloud shapes
      const s = c.seed;
      const puffs: Array<[number, number, number, number]> = [
        [0, 0, hw, hh],
        [hw * 0.4, -hh * 0.2, hw * 0.7, hh * 0.8],
        [-hw * 0.35, -hh * 0.15, hw * 0.65, hh * 0.75],
        [hw * 0.15, hh * 0.2, hw * 0.55, hh * 0.6],
        [-hw * 0.2, hh * 0.15, hw * 0.5, hh * 0.55],
        [hw * 0.6, 0.1 * hh, hw * 0.45, hh * 0.55],
        [-hw * 0.55, 0.05 * hh, hw * 0.4, hh * 0.5],
      ];

      const cloudColor = rgba(pal.cloud, 1);

      // Apply a large blur for soft edges
      ctx!.filter = `blur(${Math.round(lerp(20, 40, c.depth))}px)`;
      ctx!.fillStyle = cloudColor;

      for (const [dx, dy, rx, ry] of puffs) {
        ctx!.beginPath();
        ctx!.ellipse(
          cx + dx + Math.sin(s + dx) * 8,
          cy + dy + Math.cos(s + dy) * 4,
          rx, ry, 0, 0, Math.PI * 2
        );
        ctx!.fill();
      }

      ctx!.filter = 'none';
      ctx!.restore();
    }

    function drawClouds(pal: SkyPalette, dt: number) {
      for (const c of clouds) {
        c.x += c.speed * dt * 0.06;
        if (c.x - c.w > W + 100) c.x = -c.w - 100;
        if (c.x + c.w < -100) c.x = W + c.w + 100;
        drawCloud(c, pal);
      }
    }

    function drawRain(pal: SkyPalette, dt: number) {
      ctx!.save();
      for (const d of rainDrops) {
        d.y += d.speed * dt * 0.1;
        d.x += d.windOffset * d.speed * dt * 0.1;

        if (d.y > H + 20) {
          d.y = rand(-H * 0.1, -10);
          d.x = rand(-30, W + 30);
        }
        if (d.x < -50) d.x = W + 30;
        if (d.x > W + 50) d.x = -30;

        const windAngle = d.windOffset;
        const endX = d.x + windAngle * d.len * 2.5;
        const endY = d.y + d.len;

        ctx!.globalAlpha = d.opacity;
        ctx!.strokeStyle = rgba(pal.rain, isDay ? 0.6 : 0.45);
        ctx!.lineWidth = d.layer === 0 ? 0.5 : d.layer === 1 ? 0.8 : 1.1;
        ctx!.beginPath();
        ctx!.moveTo(d.x, d.y);
        ctx!.lineTo(endX, endY);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawSnow(dt: number) {
      ctx!.save();
      for (const s of snowFlakes) {
        s.y += s.speed * dt * 0.05;
        s.x += Math.sin(s.phase + s.y / 80) * s.drift * 0.25;
        if (s.y > H + 10) { s.y = -10; s.x = rand(0, W); }
        ctx!.globalAlpha = s.opacity;
        ctx!.fillStyle = '#FFFFFF';
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawHaze(pal: SkyPalette, t: number) {
      ctx!.save();
      const layers = family === 'fog' ? 5 : 3;
      for (let i = 0; i < layers; i++) {
        const y = H * lerp(0.3, 0.85, i / layers);
        const drift = (t * 0.0001 * (i + 1)) % 1;
        const xOff = drift * W * 0.3;
        const hazeH = H * lerp(0.08, 0.2, i / layers);
        const opacity = family === 'fog'
          ? lerp(0.12, 0.22, i / layers)
          : lerp(0.04, 0.10, i / layers);

        const grad = ctx!.createLinearGradient(0, y - hazeH, 0, y + hazeH);
        grad.addColorStop(0, rgba(pal.haze, 0));
        grad.addColorStop(0.4, rgba(pal.haze, opacity));
        grad.addColorStop(0.6, rgba(pal.haze, opacity * 0.8));
        grad.addColorStop(1, rgba(pal.haze, 0));

        ctx!.fillStyle = grad;
        ctx!.fillRect(-xOff, y - hazeH, W + xOff * 2, hazeH * 2);
      }
      ctx!.restore();
    }

    function drawLightning(t: number, dt: number) {
      // Spawn new bolts
      if (t > nextLightningTime) {
        const bolt = createBolt(W, H);
        bolt.startTime = t;
        activeBolts.push(bolt);

        // Chance of a secondary flash
        if (Math.random() < 0.4) {
          const bolt2 = createBolt(W, H);
          bolt2.startTime = t + rand(80, 200);
          bolt2.brightness *= 0.5;
          activeBolts.push(bolt2);
        }

        nextLightningTime = t + rand(5000, 14000);
        ambientFlash = 0.3;
      }

      // Draw active bolts
      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];
        const elapsed = t - bolt.startTime;

        if (elapsed < 0) continue; // not started yet (secondary)
        if (elapsed > bolt.duration) {
          activeBolts.splice(i, 1);
          continue;
        }

        const progress = elapsed / bolt.duration;
        // Quick bright, slow fade
        const alpha = progress < 0.15
          ? progress / 0.15
          : Math.pow(1 - (progress - 0.15) / 0.85, 2);

        const finalAlpha = alpha * bolt.brightness;

        // Cloud illumination around origin
        ctx!.save();
        const illuminR = 200 + 100 * finalAlpha;
        const glow = ctx!.createRadialGradient(
          bolt.originX, bolt.originY, 0,
          bolt.originX, bolt.originY, illuminR
        );
        glow.addColorStop(0, `rgba(200,210,240,${finalAlpha * 0.25})`);
        glow.addColorStop(0.5, `rgba(180,190,220,${finalAlpha * 0.1})`);
        glow.addColorStop(1, 'rgba(160,170,200,0)');
        ctx!.fillStyle = glow;
        ctx!.fillRect(
          bolt.originX - illuminR,
          bolt.originY - illuminR,
          illuminR * 2, illuminR * 2
        );
        ctx!.restore();

        // Draw bolt segments
        ctx!.save();
        ctx!.globalAlpha = finalAlpha;
        ctx!.lineCap = 'round';
        ctx!.lineJoin = 'round';

        // Outer glow
        ctx!.shadowColor = 'rgba(180,200,255,0.8)';
        ctx!.shadowBlur = 12;
        ctx!.strokeStyle = `rgba(220,230,255,${finalAlpha * 0.6})`;
        for (const seg of bolt.segments) {
          ctx!.lineWidth = seg.width + 3;
          ctx!.beginPath();
          ctx!.moveTo(seg.x1, seg.y1);
          ctx!.lineTo(seg.x2, seg.y2);
          ctx!.stroke();
        }

        // Core
        ctx!.shadowBlur = 4;
        ctx!.shadowColor = 'rgba(230,240,255,1)';
        ctx!.strokeStyle = `rgba(245,248,255,${finalAlpha})`;
        for (const seg of bolt.segments) {
          ctx!.lineWidth = seg.width;
          ctx!.beginPath();
          ctx!.moveTo(seg.x1, seg.y1);
          ctx!.lineTo(seg.x2, seg.y2);
          ctx!.stroke();
        }
        ctx!.restore();
      }

      // Ambient screen flash (subtle)
      if (ambientFlash > 0) {
        ctx!.save();
        ctx!.globalAlpha = ambientFlash * 0.08;
        ctx!.fillStyle = '#C0D0F0';
        ctx!.fillRect(0, 0, W, H);
        ctx!.restore();
        ambientFlash -= dt * 0.003;
        if (ambientFlash < 0) ambientFlash = 0;
      }
    }

    function drawFog(pal: SkyPalette, t: number) {
      ctx!.save();
      for (let i = 0; i < 5; i++) {
        const y = H * (0.2 + i * 0.16);
        const drift = ((t * 0.00004 * (i + 1)) % 1);
        const offset = drift * W;
        const h = H * 0.15;

        ctx!.filter = 'blur(30px)';
        const grad = ctx!.createLinearGradient(offset - W * 0.3, 0, offset + W * 0.3, 0);
        grad.addColorStop(0, rgba(pal.haze, 0));
        grad.addColorStop(0.3, rgba(pal.haze, isDay ? 0.14 : 0.08));
        grad.addColorStop(0.7, rgba(pal.haze, isDay ? 0.12 : 0.06));
        grad.addColorStop(1, rgba(pal.haze, 0));
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, y - h * 0.5, W, h);
        ctx!.filter = 'none';
      }
      ctx!.restore();
    }

    /* ─────── animation loop ─────── */
    let lastTime = performance.now();
    targetPalette = getPalette(family, isDay);
    currentPalette = targetPalette;
    paletteT = 1;

    function frame(t: number) {
      const dt = Math.min(t - lastTime, 50);
      lastTime = t;

      // Smooth palette transition
      if (paletteT < 1) {
        paletteT = Math.min(1, paletteT + dt * 0.0008); // ~1.2s transition
      }

      const pal = blendedPalette();

      // Clear and draw sky
      drawSkyGradient(pal);

      // Stars (behind everything)
      if (showStars) drawStars(t);

      // Moon
      if (showMoon) drawMoon(pal, t);

      // Sun (before clouds so clouds can partially occlude)
      if (showSun) drawSun(pal, t);

      // Haze (back layer)
      if (showHaze) drawHaze(pal, t);

      // Fog-specific overlay
      if (family === 'fog') drawFog(pal, t);

      // Clouds (multi-depth)
      if (clouds.length > 0) drawClouds(pal, dt);

      // Snow
      if (showSnow) drawSnow(dt);

      // Rain
      if (showRain) drawRain(pal, dt);

      // Lightning (on top of everything in the background)
      if (showLightning) drawLightning(t, dt);

      animRef.current = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else if (!reduceMotion) {
        lastTime = performance.now();
        animRef.current = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    if (reduceMotion) {
      frame(performance.now());
      cancelAnimationFrame(animRef.current);
    } else {
      animRef.current = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [family, isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      aria-hidden="true"
    />
  );
}