import fs from 'fs';
import path from 'path';

export interface TokenomicsSummary {
  totalSupply: number;
  circulatingSupply: number;
  source: 'toml' | 'env' | 'static' | 'unknown';
}

const DEFAULT_TOTAL_SUPPLY = 444_444_444_444;

function parseNumberFromString(input: string): number | null {
  const match = input.match(/(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?/);
  if (!match) return null;
  const normalized = match[0].replace(/,/g, '');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export class TokenomicsService {
  static getTokenomicsFromToml(): TokenomicsSummary | null {
    try {
      const tomlPath = path.join(process.cwd(), 'public', '.well-known', 'stellar.toml');
      const raw = fs.readFileSync(tomlPath, 'utf8');

      // totalSupply from fixed_number=444444444444
      const fixedMatch = raw.match(/fixed_number\s*=\s*(\d+)/i);
      const totalSupply = fixedMatch ? Number(fixedMatch[1]) : DEFAULT_TOTAL_SUPPLY;

      // circulating from conditions line e.g., "2,000 tokens are currently in circulation"
      let circulating = 0;
      const condMatch = raw.match(/conditions\s*=\s*"([^"]+)"/i);
      if (condMatch) {
        const sentence = condMatch[1];
        const circPhrase = sentence.match(/([\d,]+)\s+tokens\s+are\s+currently\s+in\s+circulation/i)
          || sentence.match(/only\s+([\d,]+)\s+tokens/i);
        if (circPhrase) {
          const parsed = parseNumberFromString(circPhrase[1]);
          if (parsed !== null) circulating = parsed;
        }
      }

      return {
        totalSupply,
        circulatingSupply: circulating,
        source: 'toml'
      };
    } catch {
      return null;
    }
  }

  static getTokenomicsFromEnv(): TokenomicsSummary | null {
    const total = process.env.TOTAL_SUPPLY;
    const circ = process.env.CIRCULATING_SUPPLY;
    const totalSupply = total ? Number(total) : DEFAULT_TOTAL_SUPPLY;
    const circulatingSupply = circ ? Number(circ) : NaN;
    if (!Number.isFinite(circulatingSupply)) return null;
    return {
      totalSupply,
      circulatingSupply,
      source: 'env'
    };
  }

  static getTokenomics(): TokenomicsSummary {
    return (
      this.getTokenomicsFromToml() ||
      this.getTokenomicsFromEnv() || {
        totalSupply: DEFAULT_TOTAL_SUPPLY,
        circulatingSupply: 0,
        source: 'static'
      }
    );
  }
}


