'use client';

import { useState } from 'react';
import { GraduationCap, ChevronDown, ChevronUp, User } from 'lucide-react';

interface Profile {
  id: number;
  title: string;
  seniority: string;
  primaryTech: string;
  keySkills: string[];
  education: string;
  notes: string;
}

interface ProfileCardProps {
  profile: Profile;
  index: number;
}

const SENIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Senior: { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', dot: '#3b82f6' },
  Lead: { bg: 'rgba(139, 92, 246, 0.1)', text: '#a78bfa', dot: '#8b5cf6' },
  Principal: { bg: 'rgba(245, 158, 11, 0.1)', text: '#fbbf24', dot: '#f59e0b' },
  Mid: { bg: 'rgba(45, 212, 191, 0.1)', text: '#5eead4', dot: '#2dd4bf' },
};

const TECH_COLORS: Record<string, { bg: string; text: string }> = {
  Fullstack: { bg: 'rgba(45, 212, 191, 0.08)', text: '#5eead4' },
  Backend: { bg: 'rgba(59, 130, 246, 0.08)', text: '#60a5fa' },
  Frontend: { bg: 'rgba(244, 63, 94, 0.08)', text: '#fb7185' },
  Product: { bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24' },
};

export function ProfileCard({ profile, index }: ProfileCardProps) {
  const [expanded, setExpanded] = useState(false);

  const seniorityColor = SENIORITY_COLORS[profile.seniority] || SENIORITY_COLORS.Senior;
  const techColor = TECH_COLORS[profile.primaryTech] || TECH_COLORS.Fullstack;

  const isLongNotes = profile.notes.length > 180;
  const displayNotes = expanded || !isLongNotes
    ? profile.notes
    : profile.notes.slice(0, 180) + '...';

  return (
    <div
      className={`animate-fade-up stagger-${index + 1} group`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '2px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-accent)';
        e.currentTarget.style.background = 'var(--bg-card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, ${seniorityColor.dot}, transparent)`,
        }}
      />

      <div className="p-4">
        {/* Header row: candidate number + badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
              style={{ background: seniorityColor.bg }}
            >
              <User size={14} style={{ color: seniorityColor.text }} />
            </div>
            <div className="min-w-0">
              <h3
                className="text-[14px] font-semibold leading-tight truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {profile.title}
              </h3>
            </div>
          </div>

          {/* Candidate index */}
          <span
            className="text-[10px] font-mono shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-sm"
            style={{ background: seniorityColor.bg, color: seniorityColor.text }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: seniorityColor.dot }}
            />
            {profile.seniority}
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono rounded-sm"
            style={{ background: techColor.bg, color: techColor.text }}
          >
            {profile.primaryTech}
          </span>
        </div>

        {/* Notes */}
        <p
          className="text-[13px] leading-relaxed mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {displayNotes}
          {isLongNotes && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-0.5 ml-1 text-[12px] font-mono cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-green)' }}
            >
              {expanded ? (
                <>less <ChevronUp size={12} /></>
              ) : (
                <>more <ChevronDown size={12} /></>
              )}
            </button>
          )}
        </p>

        {/* Skills */}
        {profile.keySkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.keySkills.map((skill, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Education footer */}
        {profile.education && (
          <div
            className="flex items-center gap-1.5 pt-2"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <GraduationCap size={12} style={{ color: 'var(--text-muted)' }} />
            <span
              className="text-[11px] font-mono truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.education}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
