'use client';

import { Search, RotateCw } from 'lucide-react';

type CountsMap = Record<string, Record<string, number>>;

interface FilterBarProps {
  seniority: string;
  tech: string;
  skill: string;
  onSeniorityChange: (value: string) => void;
  onTechChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  resultCount: number;
  totalMatches: number;
  counts: CountsMap;
}

const SENIORITY_OPTIONS = [
  { value: '', label: 'Any Seniority' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Principal', label: 'Principal' },
  { value: 'Mid', label: 'Mid-Level' },
];

const TECH_OPTIONS = [
  { value: '', label: 'Any Stack' },
  { value: 'Fullstack', label: 'Fullstack' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Product', label: 'Product' },
];

const SKILL_OPTIONS = [
  { value: '', label: 'Any Skill' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'React', label: 'React' },
  { value: 'Python', label: 'Python' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Java', label: 'Java' },
  { value: 'C#', label: 'C#' },
  { value: 'Go', label: 'Go' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Vue', label: 'Vue' },
  { value: 'AWS', label: 'AWS' },
  { value: 'Docker', label: 'Docker' },
  { value: 'Kubernetes', label: 'Kubernetes' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
  { value: 'MongoDB', label: 'MongoDB' },
];

/** Look up pre-computed count for a tech × seniority combo */
function getCount(counts: CountsMap, tech: string, seniority: string): number | null {
  return counts[tech]?.[seniority] ?? null;
}

export function FilterBar({
  seniority,
  tech,
  skill,
  onSeniorityChange,
  onTechChange,
  onSkillChange,
  onSearch,
  loading,
  resultCount,
  totalMatches,
  counts,
}: FilterBarProps) {
  // Live count based on current filter selection (before clicking search)
  const liveCount = getCount(counts, tech, seniority);
  return (
    <div className="animate-fade-up stagger-1">
      {/* Terminal-style label */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[11px] tracking-[0.2em] uppercase font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          filter_candidates
        </span>
        <div className="accent-line flex-1" />
      </div>

      {/* Row 1: Seniority + Tech */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        {/* Seniority Select */}
        <div className="flex-1 min-w-0">
          <label
            className="block text-[10px] tracking-[0.15em] uppercase font-mono mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            seniority
          </label>
          <select
            value={seniority}
            onChange={(e) => onSeniorityChange(e.target.value)}
            className="w-full h-10 px-3 text-sm font-mono rounded-sm border transition-all duration-200"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {SENIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tech Select */}
        <div className="flex-1 min-w-0">
          <label
            className="block text-[10px] tracking-[0.15em] uppercase font-mono mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            tech_stack
          </label>
          <select
            value={tech}
            onChange={(e) => onTechChange(e.target.value)}
            className="w-full h-10 px-3 text-sm font-mono rounded-sm border transition-all duration-200"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {TECH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Select */}
        <div className="flex-1 min-w-0">
          <label
            className="block text-[10px] tracking-[0.15em] uppercase font-mono mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            skill
          </label>
          <select
            value={skill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="w-full h-10 px-3 text-sm font-mono rounded-sm border transition-all duration-200"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {SKILL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Search Button */}
      <div className="mt-3">
        <button
          onClick={onSearch}
          disabled={loading}
          className="h-10 px-5 text-sm font-medium font-mono rounded-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          style={{
            background: loading ? 'var(--accent-green-dim)' : 'var(--accent-green)',
            color: 'var(--bg-primary)',
          }}
        >
          {loading ? (
            <RotateCw size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}
          {loading ? 'Scanning...' : 'Show Candidates'}
        </button>
      </div>

      {/* Live count preview — shows before search based on selected filters */}
      {liveCount !== null && !loading && !resultCount && (
        <div
          className="mt-3 text-[11px] font-mono animate-fade-in"
          style={{ color: 'var(--text-muted)' }}
        >
          {liveCount} candidate{liveCount !== 1 ? 's' : ''} in pool
          {skill && (
            <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              {' '}(before skill filter)
            </span>
          )}
        </div>
      )}

      {/* Result count indicator — shows after search */}
      {resultCount > 0 && !loading && (
        <div
          className="mt-3 text-[11px] font-mono animate-fade-in"
          style={{ color: 'var(--accent-green)' }}
        >
          → showing {resultCount} of {totalMatches} matching profile{totalMatches !== 1 ? 's' : ''}
          {liveCount !== null && liveCount > totalMatches && skill && (
            <span style={{ color: 'var(--text-muted)' }}>
              {' '}({liveCount} total in this category)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
