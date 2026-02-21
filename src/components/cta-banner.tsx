'use client';

import { MessageCircle, Mail, ArrowRight } from 'lucide-react';

export function CtaBanner() {
  return (
    <div
      className="animate-fade-up relative overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '2px',
      }}
    >
      {/* Top accent */}
      <div
        className="h-[2px] w-full"
        style={{
          background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue), transparent)',
        }}
      />

      {/* Background glow effect */}
      <div
        className="absolute top-0 left-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'var(--accent-green-glow)' }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Text */}
          <div>
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Want to contact them and many more with the accurate experience you need?
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              Let&apos;s partner up!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href="https://wa.me/972542228703?text=Hi%20Liat%2C%20I%20saw%20candidates%20on%20ValueMaker%20and%20I%27d%20like%20to%20learn%20more."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium font-mono rounded-sm transition-all duration-200 animate-pulse-glow"
              style={{
                background: 'var(--accent-green)',
                color: 'var(--bg-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#966DFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-green)';
              }}
            >
              <MessageCircle size={15} />
              WhatsApp Liat
              <ArrowRight size={13} />
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&to=Liatkling@added-value.co.il&su=ValueMaker%20%E2%80%94%20Interested%20in%20candidates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-mono rounded-sm border transition-all duration-200"
              style={{
                borderColor: 'var(--border-accent)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Mail size={15} />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
