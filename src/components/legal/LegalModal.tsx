import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, ArrowLeft, Printer, Check, Link as LinkIcon, ExternalLink } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';

export type LegalTab = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  onTabChange?: (tab: LegalTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tab: LegalTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
    window.location.hash = tab === 'privacy' ? '#privacy' : '#terms';
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${activeTab}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative flex flex-col h-[90vh] max-h-[850px] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0A0E18]/90 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Ambient Top Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-48 w-96 -translate-x-1/2 rounded-full bg-[var(--sky)]/15 blur-3xl" />

            {/* Modal Header */}
            <div className="flex flex-col border-b border-white/[0.08] bg-white/[0.02] px-5 py-4 sm:px-7 sm:py-5">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Brand / Title */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={onClose}
                    className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors hover:border-white/20 hover:text-white"
                    aria-label="Back to weather dashboard"
                    title="Back to weather dashboard"
                  >
                    <ArrowLeft className="size-4" />
                  </motion.button>
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo.png"
                        alt="Skylio"
                        className="size-6 rounded-lg object-contain border border-white/10 shadow-sm"
                        width={24}
                        height={24}
                      />
                      <span className="font-display text-lg font-bold tracking-tight text-white">
                        Sky<span className="text-[var(--sky)]">lio</span>
                      </span>
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                        Legal
                      </span>
                    </div>
                    <p id="legal-modal-title" className="text-xs text-white/50">
                      Transparency, governance, and data commitments
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white"
                    title="Copy direct share link"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-400" /> : <LinkIcon className="size-3.5" />}
                    <span>{copied ? 'Link Copied' : 'Share'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white"
                    title="Print document"
                  >
                    <Printer className="size-3.5" />
                    <span>Print</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="flex size-8.5 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    aria-label="Close dialog"
                  >
                    <X className="size-4" />
                  </motion.button>
                </div>
              </div>

              {/* Tab Navigation Pill Dock */}
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/40 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => handleTabSelect('privacy')}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'privacy' ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {activeTab === 'privacy' && (
                    <motion.div
                      layoutId="legalTabIndicator"
                      className="absolute inset-0 rounded-xl border border-sky-400/30 bg-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <ShieldCheck className="size-4 relative z-10 text-[var(--sky)]" />
                  <span className="relative z-10">Privacy Policy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabSelect('terms')}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'terms' ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {activeTab === 'terms' && (
                    <motion.div
                      layoutId="legalTabIndicator"
                      className="absolute inset-0 rounded-xl border border-amber-400/30 bg-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <FileText className="size-4 relative z-10 text-[var(--gold)]" />
                  <span className="relative z-10">Terms & Conditions</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7 space-y-6"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'privacy' ? (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PrivacyPolicy />
                  </motion.div>
                ) : (
                  <motion.div
                    key="terms"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TermsConditions />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Footer Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08] bg-white/[0.02] px-6 py-4 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>Zero Trackers • Client-Side Execution • Open Source MIT</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[var(--sky)] hover:text-white transition-colors"
                >
                  <span>Open-Meteo Attribution</span>
                  <ExternalLink className="size-3" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1 text-white font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
