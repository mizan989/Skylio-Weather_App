import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart as ChartIcon, LayoutList, Droplets } from 'lucide-react';
import { getWeatherMeta } from '../lib/weatherCodes';
import { getCurrentHourIndex, formatHourLabel } from '../lib/time';
import type { HourlyData, TempUnit, TimeFormat } from '../types/weather';

interface HourlyChartProps {
  hourly: HourlyData;
  timezone: string;
  unit: TempUnit;
  timeFormat?: TimeFormat;
}

export default function HourlyChart({
  hourly,
  timezone,
  unit,
  timeFormat = '12h',
}: HourlyChartProps) {
  const [activeMode, setActiveMode] = useState<'chart' | 'cards'>('chart');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // Timezone-aware 24h window
  const sliceIndices = useMemo(() => {
    const currentIdx = getCurrentHourIndex(hourly.time, timezone);
    const count = Math.min(24, hourly.time.length - currentIdx);
    return Array.from({ length: Math.max(count, 1) }, (_, i) => currentIdx + i).filter(
      (i) => i < hourly.time.length
    );
  }, [hourly.time, timezone]);

  const temps = useMemo(() => sliceIndices.map((i) => hourly.temperature_2m[i]), [sliceIndices, hourly.temperature_2m]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 28;
  const paddingY = 36;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Generate SVG coordinate points
  const points = useMemo(() => {
    return sliceIndices.map((i, ptIdx) => {
      const x = paddingX + (ptIdx / (sliceIndices.length - 1 || 1)) * graphWidth;
      const normY = (hourly.temperature_2m[i] - minTemp) / tempRange;
      const y = svgHeight - paddingY - normY * graphHeight;
      return { x, y, index: i, ptIdx };
    });
  }, [sliceIndices, hourly.temperature_2m, minTemp, tempRange, graphWidth, graphHeight]);

  // Smooth Bezier path
  const { pathD, areaD } = useMemo(() => {
    if (points.length === 0) return { pathD: '', areaD: '' };
    let path = `M ${points[0].x} ${points[0].y}`;
    let area = `M ${points[0].x} ${svgHeight - paddingY + 16} L ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      area += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    area += ` L ${points[points.length - 1].x} ${svgHeight - paddingY + 16} Z`;
    return { pathD: path, areaD: area };
  }, [points, svgHeight, paddingY]);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current || points.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = (mouseX / rect.width) * svgWidth;

    let closest = points[0].index;
    let minDistance = Infinity;
    for (const pt of points) {
      const dist = Math.abs(pt.x - normX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pt.index;
      }
    }
    setHoverIdx(closest);
  };

  const selectedIdx = hoverIdx ?? sliceIndices[0] ?? 0;
  const selectedTimeIso = hourly.time[selectedIdx] ?? '';
  const selectedTimeLabel = formatHourLabel(selectedTimeIso, timezone, timeFormat === '24h');
  const selectedHour = new Date(selectedTimeIso).getHours();
  const selectedIsDay = selectedHour >= 6 && selectedHour < 20;
  const { label: selectedLabel, icon: SelectedIcon } = getWeatherMeta(
    hourly.weather_code[selectedIdx] ?? 0,
    selectedIsDay
  );

  return (
    <section
      aria-label="Hourly Forecast"
      className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
    >
      {/* Top Header with view toggles */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
            24-Hour Forecast
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-white/35">
            Hourly temperature & precipitation
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-0.5">
          <button
            type="button"
            onClick={() => setActiveMode('chart')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
              activeMode === 'chart'
                ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <ChartIcon size={12} />
            <span className="hidden sm:inline">Graph</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('cards')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
              activeMode === 'cards'
                ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <LayoutList size={12} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMode === 'chart' ? (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 flex flex-col gap-3"
          >
            {/* Scrubber inspection readout */}
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
              <div className="flex items-center gap-2">
                <SelectedIcon size={16} className="text-[var(--sky)] shrink-0" />
                <span className="font-mono text-xs font-medium text-white">
                  {selectedTimeLabel}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/70">{selectedLabel}</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="font-semibold text-white tabular-nums">
                  {Math.round(hourly.temperature_2m[selectedIdx] ?? 0)}°{unit === 'celsius' ? 'C' : 'F'}
                </span>
                {hourly.precipitation_probability[selectedIdx] > 0 && (
                  <span className="flex items-center gap-1 text-[var(--sky)]">
                    <Droplets size={11} />
                    <span>{hourly.precipitation_probability[selectedIdx]}%</span>
                  </span>
                )}
              </div>
            </div>

            {/* SVG Wave Chart */}
            <div className="relative w-full overflow-hidden">
              <svg
                ref={chartRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="h-44 w-full touch-pan-x cursor-crosshair overflow-visible select-none"
                onMouseMove={handleSvgMouseMove}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <defs>
                  <linearGradient id="hourlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#70B8FF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#70B8FF" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="hourlyStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#70B8FF" />
                    <stop offset="50%" stopColor="#B3D7FF" />
                    <stop offset="100%" stopColor="#FFD166" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                {areaD && <path d={areaD} fill="url(#hourlyAreaGrad)" />}

                {/* Primary Temperature Curve */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#hourlyStrokeGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Subtle vertical scrub guide */}
                {points.map((pt) => {
                  if (pt.index !== selectedIdx) return null;
                  return (
                    <g key={`scrub-${pt.index}`}>
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={svgHeight - paddingY + 12}
                        stroke="rgba(255,255,255,0.2)"
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#FFFFFF"
                        stroke="#70B8FF"
                        strokeWidth="2.5"
                        className="filter drop-shadow-[0_0_8px_rgba(112,184,255,0.6)]"
                      />
                    </g>
                  );
                })}

                {/* X-axis time marks (every 3rd or 4th point) */}
                {points.map((pt, idx) => {
                  if (idx % 3 !== 0 && idx !== points.length - 1) return null;
                  const label = formatHourLabel(hourly.time[pt.index], timezone, timeFormat === '24h');
                  return (
                    <text
                      key={`label-${pt.index}`}
                      x={pt.x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className="fill-white/40 font-mono text-[11px]"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 flex gap-2.5 overflow-x-auto pb-2 scroll-smooth focus:outline-none"
          >
            {sliceIndices.map((i, order) => {
              const timeStr = formatHourLabel(hourly.time[i], timezone, timeFormat === '24h');
              const h = new Date(hourly.time[i]).getHours();
              const isD = h >= 6 && h < 20;
              const { icon: HourlyIcon } = getWeatherMeta(hourly.weather_code[i], isD);
              const pProb = hourly.precipitation_probability[i] ?? 0;
              const isSelected = i === selectedIdx;

              return (
                <button
                  key={hourly.time[i]}
                  type="button"
                  onClick={() => setHoverIdx(i)}
                  className={`flex min-w-[70px] flex-col items-center justify-between rounded-2xl border p-3 transition-all ${
                    isSelected
                      ? 'border-[var(--sky)]/50 bg-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="font-mono text-[11px] text-white/50">
                    {order === 0 ? 'Now' : timeStr}
                  </span>

                  <div className="my-2 text-[var(--sky)]">
                    <HourlyIcon size={20} strokeWidth={1.4} />
                  </div>

                  <span className="font-mono text-sm font-semibold text-white tabular-nums">
                    {Math.round(hourly.temperature_2m[i])}°
                  </span>

                  <div className="mt-1 h-3.5">
                    {pProb > 0 ? (
                      <span className="flex items-center gap-0.5 font-mono text-[10px] text-[var(--sky)] font-medium">
                        <Droplets size={9} />
                        <span>{pProb}%</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-white/20">•</span>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
