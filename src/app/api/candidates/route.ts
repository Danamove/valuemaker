import { NextRequest, NextResponse } from 'next/server';

interface SheetRow {
  c: (null | { v: string | number | null })[];
}

interface SheetData {
  table: {
    cols: { label: string }[];
    rows: SheetRow[];
  };
}

interface AnonymizedProfile {
  id: number;
  title: string;
  seniority: string;
  primaryTech: string;
  keySkills: string[];
  education: string;
  notes: string;
}

// Column indices in sanitized Google Sheet (no PII columns exist)
const COL = {
  TITLE: 0,
  SENIORITY: 1,
  PRIMARY_TECH: 2,
  KEY_SKILLS: 3,
  EDUCATION: 4,
  NOTES: 5,
} as const;

const SHEET_ID = '1MQ034c7ZOJM8ZskeGwpIpfgnL1_mObBEsy03odvPYhw';
const SHEET_NAME = 'Warm Pool';

/** Normalize product-related tech values into a single "Product" category */
function normalizeTech(tech: string): string {
  if (tech.toLowerCase().includes('product')) return 'Product';
  return tech;
}

function getCell(row: SheetRow, index: number): string {
  return row.c[index]?.v?.toString() ?? '';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seniority = searchParams.get('seniority') || '';
    const tech = searchParams.get('tech') || '';
    const skill = searchParams.get('skill') || '';

    // Fetch from Google Sheets (server-side only - Sheet ID never exposed to client)
    const encodedSheet = encodeURIComponent(SHEET_NAME);
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodedSheet}&headers=1`;

    const response = await fetch(url, { next: { revalidate: 300 } }); // 5 min cache
    const text = await response.text();

    // Parse gviz JSON response
    const jsonStr = text.replace(/^[^\(]+\(/, '').replace(/\);$/, '');
    const data: SheetData = JSON.parse(jsonStr);

    // Pre-compute counts for every tech × seniority combo
    // Keys: '' = any, 'Backend' = specific tech, 'Senior' = specific seniority
    const counts: Record<string, Record<string, number>> = { '': {} };

    for (const row of data.table.rows) {
      const notes = getCell(row, COL.NOTES);
      if (!notes) continue;

      const t = normalizeTech(getCell(row, COL.PRIMARY_TECH));
      const s = getCell(row, COL.SENIORITY);

      // Initialize nested maps
      if (!counts[t]) counts[t] = {};

      // Increment all 4 combinations: specific×specific, specific×any, any×specific, any×any
      counts[t][s] = (counts[t][s] || 0) + 1;
      counts[t][''] = (counts[t][''] || 0) + 1;
      counts[''][s] = (counts[''][s] || 0) + 1;
      counts[''][''] = (counts[''][''] || 0) + 1;
    }

    // Transform and filter profiles
    let profiles: AnonymizedProfile[] = data.table.rows
      .map((row, index): AnonymizedProfile | null => {
        const notes = getCell(row, COL.NOTES);
        if (!notes) return null; // Skip profiles without notes

        const rowSeniority = getCell(row, COL.SENIORITY);
        const rowTech = normalizeTech(getCell(row, COL.PRIMARY_TECH));

        // Apply filters
        if (seniority && rowSeniority !== seniority) return null;
        if (tech && rowTech !== tech) return null;

        const skillsRaw = getCell(row, COL.KEY_SKILLS);
        const keySkills = skillsRaw
          ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8)
          : [];

        // Skill filter — case-insensitive match against keySkills
        if (skill) {
          const skillLower = skill.toLowerCase();
          const hasSkill = keySkills.some(s => s.toLowerCase().includes(skillLower));
          if (!hasSkill) return null;
        }

        return {
          id: index + 2, // Row number (1-indexed + header)
          title: getCell(row, COL.TITLE),
          seniority: rowSeniority,
          primaryTech: rowTech,
          keySkills,
          education: getCell(row, COL.EDUCATION),
          notes,
        };
      })
      .filter((p): p is AnonymizedProfile => p !== null);

    // Save total before slicing
    const totalMatches = profiles.length;

    // Randomly pick 5
    profiles = shuffleArray(profiles).slice(0, 5);

    return NextResponse.json(
      { profiles, totalMatches, counts },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
