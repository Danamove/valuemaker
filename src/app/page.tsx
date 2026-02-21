'use client';

import { useState, useCallback, useEffect } from 'react';
import { Zap, Database, ShieldCheck } from 'lucide-react';
import { FilterBar } from '@/components/filter-bar';
import { ProfileCard } from '@/components/profile-card';
import { CtaBanner } from '@/components/cta-banner';

interface Profile {
  id: number;
  title: string;
  seniority: string;
  primaryTech: string;
  keySkills: string[];
  education: string;
  notes: string;
}

// Nested map: counts[tech][seniority] = number ('' key = "any")
type CountsMap = Record<string, Record<string, number>>;

export default function Home() {
  const [seniority, setSeniority] = useState('');
  const [tech, setTech] = useState('');
  const [skill, setSkill] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [counts, setCounts] = useState<CountsMap>({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch counts on mount (no filters = all combos)
  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        if (data.counts) setCounts(data.counts);
      })
      .catch(() => {});
  }, []);

  // Clear stale results when filters change so live count shows
  useEffect(() => {
    if (hasSearched) {
      setProfiles([]);
      setTotalMatches(0);
      setHasSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seniority, tech, skill]);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (seniority) params.set('seniority', seniority);
      if (tech) params.set('tech', tech);
      if (skill) params.set('skill', skill);

      const res = await fetch(`/api/candidates?${params.toString()}`);
      const data = await res.json();
      setProfiles(data.profiles || []);
      setTotalMatches(data.totalMatches || 0);
      if (data.counts) setCounts(data.counts);
    } catch {
      setProfiles([]);
      setTotalMatches(0);
    } finally {
      setLoading(false);
    }
  }, [seniority, tech, skill]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient background glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-30"
        style={{ background: 'var(--accent-green-glow)' }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--accent-green)' }}
            />
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-mono"
              style={{ color: 'var(--accent-green)' }}
            >
              live pool
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Value
            <span style={{ color: 'var(--accent-green)' }}>Maker</span>
          </h1>

          <p
            className="text-sm font-mono mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            by{' '}
            <span style={{ color: 'var(--text-secondary)' }}>AddedValue</span>
            {' '}&mdash; passive tech talents, anonymized
          </p>

          {/* Stats bar */}
          <div
            className="flex items-center gap-4 mt-4 py-2 px-3 rounded-sm text-[11px] font-mono"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <Database size={11} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)' }}>pool:</span>
              <span style={{ color: 'var(--accent-green)' }}>100+ profiles</span>
            </div>
            <div
              className="w-px h-3"
              style={{ background: 'var(--border-subtle)' }}
            />
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={11} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)' }}>pre-vetted</span>
            </div>
            <div
              className="w-px h-3 hidden sm:block"
              style={{ background: 'var(--border-subtle)' }}
            />
            <div className="hidden sm:flex items-center gap-1.5">
              <Zap size={11} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)' }}>available now</span>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="accent-line mb-6" />

        {/* Filter Bar */}
        <FilterBar
          seniority={seniority}
          tech={tech}
          skill={skill}
          onSeniorityChange={setSeniority}
          onTechChange={setTech}
          onSkillChange={setSkill}
          onSearch={fetchCandidates}
          loading={loading}
          resultCount={profiles.length}
          totalMatches={totalMatches}
          counts={counts}
        />

        {/* Results Section */}
        <div className="mt-6 space-y-3">
          {/* Loading skeletons */}
          {loading && (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`skeleton rounded-sm stagger-${i}`}
                  style={{
                    height: '140px',
                    border: '1px solid var(--border-subtle)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </>
          )}

          {/* Profile cards */}
          {!loading && profiles.length > 0 && (
            <>
              {profiles.map((profile, i) => (
                <ProfileCard key={profile.id} profile={profile} index={i} />
              ))}
            </>
          )}

          {/* Empty state */}
          {!loading && hasSearched && profiles.length === 0 && (
            <div
              className="text-center py-12 animate-fade-in rounded-sm"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                className="text-[13px] font-mono mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                no_matches_found
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Try adjusting your filters or{' '}
                <button
                  onClick={() => {
                    setSeniority('');
                    setTech('');
                    setSkill('');
                  }}
                  className="font-mono cursor-pointer hover:opacity-80"
                  style={{ color: 'var(--accent-green)' }}
                >
                  reset all
                </button>
              </p>
            </div>
          )}

          {/* Initial state — before first search */}
          {!loading && !hasSearched && (
            <div
              className="text-center py-16 animate-fade-in rounded-sm"
              style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <div
                className="text-[13px] font-mono mb-2 cursor-blink"
                style={{ color: 'var(--text-muted)' }}
              >
                awaiting_query
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Select filters above and hit{' '}
                <span
                  className="font-mono px-1.5 py-0.5 rounded-sm"
                  style={{
                    background: 'var(--accent-green-glow)',
                    color: 'var(--accent-green)',
                  }}
                >
                  Show Candidates
                </span>
              </p>
            </div>
          )}
        </div>

        {/* CTA — show after results */}
        {!loading && profiles.length > 0 && (
          <div className="mt-8">
            <CtaBanner />
          </div>
        )}

        {/* Footer */}
        <footer
          className="mt-12 pt-4 text-center text-[11px] font-mono"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          ValueMaker by Added Value &mdash; Precision Tech Recruitment
        </footer>
      </div>
    </div>
  );
}
