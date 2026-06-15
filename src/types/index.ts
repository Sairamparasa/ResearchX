export interface Source {
  id: string;
  url: string;
  title: string;
  domain: string;
  reliability: number; // 0-100
  agreement: 'agree' | 'neutral' | 'disagree';
  freshness: number; // 0-100
  status: 'discovered' | 'crawled' | 'failed';
  publishedDate?: string;
  favicon?: string;
}

export interface Evidence {
  id: string;
  sourceId: string;
  claim: string;
  date: string;
  metric?: string;
  value?: string;
}

export interface ChartData {
  [key: string]: string | number;
}

export interface ResearchReport {
  id: string;
  query: string;
  executiveSummary: string;
  findings: Array<{
    title: string;
    metric: string;
    description: string;
    confidence: number;
    sourcesCount: number;
  }>;
  evidenceTable: Array<{
    sourceName: string;
    sourceUrl: string;
    claim: string;
    date: string;
    reliability: number;
    agreement: 'Agree' | 'Neutral' | 'Disagree';
  }>;
  charts: Array<{
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: ChartData[];
    xAxisKey: string;
    dataKeys: string[];
  }>;
  images: Array<{
    url: string;
    title: string;
    aspectRatio?: string;
  }>;
  confidenceAnalysis: {
    score: number;
    reasonsHigh: string[];
    reasonsLow?: string[];
    agreementsText: string;
    disagreementsText: string;
  };
  citations: Array<{
    id: string;
    title: string;
    url: string;
    domain: string;
  }>;
  createdAt: string;
}
