import { CompanyData } from '../types';

export const mockCompanyData: CompanyData = {
  overview: {
    name: "Ferfie",
    description: "Family Finance for the Onchain Generation",
    founded: "2024",
    location: "San Francisco, CA",
    stage: "Pre-Seed",
    industry: "FinTech/Crypto",
    arr: "$0 (Pre-Revenue)",
    customers: "Beta Users: 150 families",
    teamSize: "4",
    growthRate: "N/A (Pre-Launch)",
    mission: "Ferfie is a crypto-powered family finance platform that helps parents teach kids aged 11–17 real-world money skills — starting with chore-based allowances and expanding into permissioned crypto spending, saving, and earning. Built on Base for speed and low fees, Ferfie makes blockchain practical, safe, and educational for families.",
    vision: "To become the leading platform for onchain family finance education, onboarding entire households to crypto",
    values: "Financial Education, Family Safety, Crypto Innovation, Transparency",
    goals: "Launch MVP Q2 2025, reach 10K families by end of 2025, expand to European markets"
  },
  financials: {
    annualRevenue: "$0 (Pre-Revenue)",
    monthlyBurn: "$25K",
    runway: "12 months",
    grossMargin: "N/A",
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    operatingExpenses: 300000,
    netIncome: -300000,
    operatingCashFlow: -300000,
    investingCashFlow: -50000,
    financingCashFlow: 500000,
    netCashFlow: 150000,
    cashBalance: 300000
  },
  team: {
    leadership: [
      { name: "Alex Chen", role: "CEO & Co-Founder", background: "Ex-Coinbase, Stanford CS" },
      { name: "Sarah Kim", role: "CTO & Co-Founder", background: "Ex-Meta, MIT Blockchain" },
      { name: "Marcus Johnson", role: "Head of Product", background: "Ex-Stripe, Product Strategy" },
      { name: "Emily Rodriguez", role: "Head of Growth", background: "Ex-Robinhood, Growth Marketing" }
    ],
    advisors: [
      { name: "Brian Armstrong", background: "CEO of Coinbase, Crypto Industry Expert" },
      { name: "Jesse Pollak", background: "Creator of Base, Onchain Advocate" },
      { name: "Linda Xie", background: "Co-founder Scalar Capital, DeFi Expert" },
      { name: "Balaji Srinivasan", background: "Former CTO Coinbase, Crypto Thought Leader" }
    ],
    totalEmployees: 4,
    engineering: 2,
    salesMarketing: 1,
    operations: 1
  },
  market: {
    tam: "$30B+ Global Allowance Market",
    sam: "$7.5B Crypto-Native Families",
    som: "$150M Addressable in Year 1",
    competitors: [
      { name: "Greenlight", type: "Traditional", description: "Banking for kids, no crypto" },
      { name: "Stockpile", type: "Investment", description: "Stock investing for kids" },
      { name: "GoHenry", type: "Traditional", description: "Prepaid cards for children" }
    ],
    trends: [
      "400M+ crypto holders globally",
      "125M likely parents with children under 18",
      "27% of teens feel confident about personal finance",
      "Growing demand for financial literacy education"
    ]
  },
  product: {
    features: [
      "Parent Dashboard with chore assignment",
      "Child profiles with stablecoin earnings",
      "Permission system for spending controls",
      "In-app NFT and token marketplace",
      "Gift card integration (Uber Eats, gaming)",
      "Onchain transaction transparency",
      "Wallet-connected authentication",
      "QR code secure access for kids"
    ],
    techStack: [
      "Next.js 14",
      "TypeScript",
      "TailwindCSS",
      "PostgreSQL",
      "Prisma",
      "Base Blockchain",
      "Ethers.js",
      "Wagmi",
      "Bitrefill API",
      "Coingecko API"
    ],
    roadmap: [
      {
        quarter: "Q1 2025",
        features: ["MVP Launch", "Basic Chore System", "USDC Integration"],
        status: "In Progress"
      },
      {
        quarter: "Q2 2025",
        features: ["NFT Marketplace", "Gift Card Integration", "Mobile App"],
        status: "Planned"
      },
      {
        quarter: "Q3 2025",
        features: ["Multi-Currency Support", "Advanced Analytics", "Family Sharing"],
        status: "Planned"
      },
      {
        quarter: "Q4 2025",
        features: ["DeFi Education", "Savings Goals", "International Expansion"],
        status: "Planned"
      }
    ]
  },
  legal: {
    entityType: "Delaware C-Corporation",
    incorporationDate: "March 2024",
    ein: "88-9876543",
    address: "548 Market St, San Francisco, CA 94104",
    intellectualProperty: [
      { type: "Trademark", name: "Ferfie", status: "Filed" },
      { type: "Patent", name: "Family Crypto Allowance System", status: "Pending" }
    ],
    compliance: [
      "COPPA Compliant",
      "GDPR Ready",
      "SOC 2 Type I (Planned)",
      "Financial Services Regulations"
    ]
  },
  funding: {
    totalRaised: "$500K",
    currentRound: "Pre-Seed",
    targetAmount: "$2M",
    useOfFunds: "Product Development (50%), Team Expansion (30%), Marketing (20%)",
    investors: [
      { name: "Coinbase Ventures", type: "Strategic", amount: "$250K" },
      { name: "Base Ecosystem Fund", type: "Strategic", amount: "$150K" },
      { name: "Angel Investors", type: "Angel", amount: "$100K" }
    ],
    valuation: "$8M Pre-Money"
  },
  metrics: [
    { label: 'Beta Families', value: '150', change: '+25%', trend: 'up' },
    { label: 'Transactions Processed', value: '2,847', change: '+45%', trend: 'up' },
    { label: 'Total Volume', value: '$12,450', change: '+67%', trend: 'up' },
    { label: 'User Retention', value: '78%', change: '+12%', trend: 'up' }
  ],
  documents: [
    {
      id: '1',
      name: 'Ferfie Pitch Deck 2024.pdf',
      type: 'PDF',
      size: '3.2 MB',
      lastModified: '2024-12-15',
      category: 'company',
      accessLevel: 'public',
      status: 'active',
      url: '',
      pinned: true
    },
    {
      id: '2',
      name: 'Financial Projections.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      lastModified: '2024-12-10',
      category: 'financial',
      accessLevel: 'confidential',
      status: 'active',
      url: '',
      pinned: false
    },
    {
      id: '3',
      name: 'Product Demo Video.mp4',
      type: 'Video',
      size: '25.6 MB',
      lastModified: '2024-12-08',
      category: 'product',
      accessLevel: 'public',
      status: 'active',
      url: '',
      pinned: true
    },
    {
      id: '4',
      name: 'Market Research Report.pdf',
      type: 'PDF',
      size: '4.1 MB',
      lastModified: '2024-12-05',
      category: 'market',
      accessLevel: 'public',
      status: 'active',
      url: '',
      pinned: false
    },
    {
      id: '5',
      name: 'Technical Architecture.pdf',
      type: 'PDF',
      size: '2.3 MB',
      lastModified: '2024-12-03',
      category: 'product',
      accessLevel: 'restricted',
      status: 'active',
      url: '',
      pinned: false
    }
  ],
  users: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@a16z.com',
      role: 'Lead Investor',
      lastAccess: '2024-12-15',
      documentsAccessed: 8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mike@coinbase.ventures',
      role: 'Strategic Investor',
      lastAccess: '2024-12-14',
      documentsAccessed: 12,
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily@base.org',
      role: 'Ecosystem Partner',
      lastAccess: '2024-12-13',
      documentsAccessed: 6,
      status: 'active'
    },
    {
      id: '4',
      name: 'David Park',
      email: 'david@legal.firm',
      role: 'Legal Advisor',
      lastAccess: '2024-12-10',
      documentsAccessed: 15,
      status: 'pending'
    }
  ]
};