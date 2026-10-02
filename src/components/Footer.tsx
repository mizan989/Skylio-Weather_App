import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  ArrowUp,
  ExternalLink,
  CloudSun,
  Wind,
  Sliders,
  Settings
} from 'lucide-react';
import type { PrimaryDestination } from '../types/weather';

interface SocialLink {
  name: string;
  url: string;
  hoverColor: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/mizan989',
    hoverColor: 'hover:text-white hover:bg-white/[0.08]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/mizanmohammadd',
    hoverColor: 'hover:text-white hover:bg-white/[0.08]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mizann989/',
    hoverColor: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/mizanmohammadd',
    hoverColor: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 0 000-2.881z"
        />
      </svg>
    ),
  },
];

interface FooterProps {
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
  onNavigateDestination?: (dest: PrimaryDestination) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigateDestination }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDestinationClick = (dest: PrimaryDestination) => {
    onNavigateDestination?.(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 mb-20 md:mb-8 flex flex-col gap-6">
      {/* Horizon Hairline Separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

      {/* Clean Restrained Footer Island */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1524]/85 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 md:p-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col gap-3.5 lg:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Skylio Logo"
                className="size-9 rounded-xl object-contain border border-white/10 shadow-sm"
                width={36}
                height={36}
              />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Sky<span className="text-[var(--sky)]">lio</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-white/60 max-w-sm font-sans">
              A minimalist, precision weather instrument delivering high-resolution atmospheric telemetry and numerical model forecasts powered by Open-Meteo.
            </p>

            <div className="flex items-center gap-2 mt-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="flex size-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Destinations */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white/40">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-mono text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => handleDestinationClick('weather')}
                  className="flex items-center gap-2 transition-colors hover:text-white text-left"
                >
                  <CloudSun size={13} className="text-white/40" />
                  <span>Main Weather</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleDestinationClick('airquality')}
                  className="flex items-center gap-2 transition-colors hover:text-white text-left"
                >
                  <Wind size={13} className="text-white/40" />
                  <span>Air Quality Index</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleDestinationClick('details')}
                  className="flex items-center gap-2 transition-colors hover:text-white text-left"
                >
                  <Sliders size={13} className="text-white/40" />
                  <span>Atmospheric Details</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleDestinationClick('settings')}
                  className="flex items-center gap-2 transition-colors hover:text-white text-left"
                >
                  <Settings size={13} className="text-white/40" />
                  <span>Preferences & Settings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Data Attribution */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white/40">
              Data & Governance
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-mono text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="flex items-center gap-2 transition-colors hover:text-[var(--sky)] text-left"
                >
                  <ShieldCheck size={13} className="text-white/40" />
                  <span>Privacy Policy (Zero Telemetry)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="flex items-center gap-2 transition-colors hover:text-white text-left"
                >
                  <FileText size={13} className="text-white/40" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <span>Data Attribution (Open-Meteo)</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mizan989/skylio/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <span>MIT License</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/[0.06] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/40">
          <span>© {currentYear} Skylio. Free & open meteorological software.</span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors self-start sm:self-auto"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
