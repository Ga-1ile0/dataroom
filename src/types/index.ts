export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: string;
  documentsAccessed: number;
  status: 'active' | 'pending';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  category: string;
  accessLevel: 'public' | 'restricted' | 'confidential';
  status: 'active' | 'archived';
  url: string;
  pinned?: boolean;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TeamMember {
  name: string;
  role: string;
  background: string;
}

export interface Advisor {
  name: string;
  background: string;
}

export interface Competitor {
  name: string;
  type: string;
  description: string;
}

export interface RoadmapItem {
  quarter: string;
  features: string[];
  status: string;
}

export interface IPItem {
  type: string;
  name: string;
  status: string;
}

export interface Investor {
  name: string;
  type: string;
  amount: string;
}

export interface CompanyData {
  overview: {
    name: string;
    description: string;
    founded: string;
    location: string;
    stage: string;
    industry: string;
    arr: string;
    customers: string;
    teamSize: string;
    growthRate: string;
    mission: string;
    vision: string;
    values: string;
    goals: string;
  };
  financials: {
    annualRevenue: string;
    monthlyBurn: string;
    runway: string;
    grossMargin: string;
    revenue: number;
    cogs: number;
    grossProfit: number;
    operatingExpenses: number;
    netIncome: number;
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
    cashBalance: number;
  };
  team: {
    leadership: TeamMember[];
    advisors: Advisor[];
    totalEmployees: number;
    engineering: number;
    salesMarketing: number;
    operations: number;
  };
  market: {
    tam: string;
    sam: string;
    som: string;
    competitors: Competitor[];
    trends: string[];
  };
  product: {
    features: string[];
    techStack: string[];
    roadmap: RoadmapItem[];
  };
  legal: {
    entityType: string;
    incorporationDate: string;
    ein: string;
    address: string;
    intellectualProperty: IPItem[];
    compliance: string[];
  };
  funding: {
    totalRaised: string;
    currentRound: string;
    targetAmount: string;
    useOfFunds: string;
    investors: Investor[];
    valuation: string;
  };
  metrics: Metric[];
  documents: Document[];
  users: User[];
}

export interface SearchResult {
  type: 'document' | 'section' | 'data';
  title: string;
  description: string;
  category: string;
  relevance: number;
  data?: any;
}