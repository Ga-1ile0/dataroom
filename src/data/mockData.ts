import { CompanyData } from '../types';

export const mockCompanyData: CompanyData = {
  overview: {
    name: "DataVault",
    description: "Secure, Beautiful Data Rooms for Modern Startups",
    founded: "2024",
    location: "San Francisco, CA",
    stage: "Seed",
    industry: "SaaS/FinTech",
    arr: "$480K ARR",
    customers: "127 startups",
    teamSize: "8",
    growthRate: "45% MoM",
    mission: "DataVault revolutionizes how startups share sensitive information with investors. Our platform combines bank-grade security with stunning design, making due diligence faster, more transparent, and delightful for both founders and investors.",
    vision: "To become the standard platform for startup fundraising and investor relations, powering every funding round globally",
    values: "Security First, Design Excellence, Transparency, Founder Success",
    goals: "Reach $2M ARR by Q4 2025, expand to European markets, launch AI-powered due diligence tools"
  },
  financials: {
    annualRevenue: "$480K ARR",
    monthlyBurn: "$45K",
    runway: "18 months",
    grossMargin: "92%",
    revenue: 480000,
    cogs: 38400,
    grossProfit: 441600,
    operatingExpenses: 540000,
    netIncome: -98400,
    operatingCashFlow: -98400,
    investingCashFlow: -75000,
    financingCashFlow: 1200000,
    netCashFlow: 1026600,
    cashBalance: 810000
  },
  team: {
    leadership: [
      { name: "Alex Rivera", role: "CEO & Co-Founder", background: "Ex-DocSend, Stanford MBA, 3x founder" },
      { name: "Maya Chen", role: "CTO & Co-Founder", background: "Ex-Stripe, MIT CS, Security Expert" },
      { name: "Jordan Kim", role: "Head of Product", background: "Ex-Notion, Design Systems Lead" },
      { name: "Sam Rodriguez", role: "Head of Growth", background: "Ex-Airtable, Growth Marketing" }
    ],
    advisors: [
      { name: "Russ Heddleston", background: "CEO of DocSend, Data Room Pioneer" },
      { name: "Melanie Perkins", background: "CEO of Canva, Design & UX Expert" },
      { name: "Patrick Collison", background: "CEO of Stripe, Payments & Security" },
      { name: "Naval Ravikant", background: "AngelList Founder, Startup Ecosystem" }
    ],
    totalEmployees: 8,
    engineering: 4,
    salesMarketing: 2,
    operations: 2
  },
  market: {
    tam: "$12B+ Global Due Diligence Market",
    sam: "$3.2B Startup Data Room Market",
    som: "$180M Addressable in Year 1",
    competitors: [
      { name: "DocSend", type: "Direct", description: "Legacy data room, limited design flexibility" },
      { name: "Carta", type: "Indirect", description: "Cap table management with basic data rooms" },
      { name: "Foundersuite", type: "Indirect", description: "CRM with simple document sharing" }
    ],
    trends: [
      "Remote due diligence becoming standard",
      "Investors demanding faster, more transparent processes",
      "Security and compliance requirements increasing",
      "Design and UX becoming competitive differentiators"
    ]
  },
  product: {
    features: [
      "Drag-and-drop data room builder",
      "Real-time investor analytics",
      "Granular permission controls",
      "Beautiful, branded experiences",
      "Advanced security & encryption",
      "Mobile-optimized viewing",
      "AI-powered document insights",
      "Investor CRM integration"
    ],
    techStack: [
      "React 18",
      "TypeScript",
      "Next.js 14",
      "Supabase",
      "TailwindCSS",
      "Framer Motion",
      "AWS S3",
      "Stripe",
      "PostHog",
      "Vercel"
    ],
    roadmap: [
      {
        quarter: "Q1 2025",
        features: ["AI Document Analysis", "Advanced Analytics", "Mobile App"],
        status: "In Progress"
      },
      {
        quarter: "Q2 2025",
        features: ["White-label Solutions", "API Platform", "Slack Integration"],
        status: "Planned"
      },
      {
        quarter: "Q3 2025",
        features: ["Virtual Data Rooms", "Video Pitching", "Multi-language Support"],
        status: "Planned"
      },
      {
        quarter: "Q4 2025",
        features: ["Blockchain Verification", "Smart Contracts", "Global Expansion"],
        status: "Planned"
      }
    ]
  },
  legal: {
    entityType: "Delaware C-Corporation",
    incorporationDate: "January 2024",
    ein: "88-1234567",
    address: "2261 Market St, San Francisco, CA 94114",
    intellectualProperty: [
      { type: "Trademark", name: "DataVault", status: "Approved" },
      { type: "Patent", name: "Secure Document Sharing System", status: "Filed" },
      { type: "Copyright", name: "DataVault Platform Software", status: "Approved" }
    ],
    compliance: [
      "SOC 2 Type II Certified",
      "GDPR Compliant",
      "CCPA Compliant",
      "ISO 27001 Certified",
      "HIPAA Ready"
    ]
  },
  funding: {
    totalRaised: "$1.2M",
    currentRound: "Seed",
    targetAmount: "$3.5M",
    useOfFunds: "Product Development (40%), Sales & Marketing (35%), Team Expansion (25%)",
    investors: [
      { name: "Bessemer Venture Partners", type: "VC", amount: "$600K" },
      { name: "First Round Capital", type: "VC", amount: "$400K" },
      { name: "Angel Investors", type: "Angel", amount: "$200K" }
    ],
    valuation: "$15M Pre-Money"
  },
  metrics: [
    { 
      label: 'Monthly Recurring Revenue', 
      value: '$40K', 
      change: '+45%', 
      trend: 'up',
      category: 'revenue',
      description: 'Subscription revenue from active customers',
      chartData: [18000, 22500, 28000, 34500, 40000],
      period: 'Last 5 months'
    },
    { 
      label: 'Active Data Rooms', 
      value: '347', 
      change: '+67%', 
      trend: 'up',
      category: 'engagement',
      description: 'Data rooms created and actively used',
      chartData: [145, 180, 220, 280, 347],
      period: 'Last 5 months'
    },
    { 
      label: 'Customer Acquisition Cost', 
      value: '$180', 
      change: '-23%', 
      trend: 'up',
      category: 'financial',
      description: 'Cost to acquire new paying customer',
      chartData: [280, 250, 220, 200, 180],
      period: 'Last 5 months'
    },
    { 
      label: 'Net Revenue Retention', 
      value: '134%', 
      change: '+12%', 
      trend: 'up',
      category: 'revenue',
      description: 'Revenue expansion from existing customers',
      chartData: [115, 120, 125, 130, 134],
      period: 'Last 5 months'
    },
    { 
      label: 'Documents Shared', 
      value: '28,947', 
      change: '+89%', 
      trend: 'up',
      category: 'engagement',
      description: 'Total documents uploaded to platform',
      chartData: [12400, 15800, 19200, 24100, 28947],
      period: 'Last 5 months'
    },
    { 
      label: 'Investor Engagement', 
      value: '87%', 
      change: '+18%', 
      trend: 'up',
      category: 'engagement',
      description: 'Investors actively viewing shared documents',
      chartData: [68, 72, 78, 83, 87],
      period: 'Last 5 months'
    },
    { 
      label: 'Average Deal Size', 
      value: '$3,780', 
      change: '+34%', 
      trend: 'up',
      category: 'revenue',
      description: 'Average annual contract value',
      chartData: [2400, 2680, 3020, 3380, 3780],
      period: 'Last 5 months'
    },
    { 
      label: 'Platform Uptime', 
      value: '99.97%', 
      change: '+0.02%', 
      trend: 'up',
      category: 'financial',
      description: 'System availability and reliability',
      chartData: [99.92, 99.94, 99.95, 99.96, 99.97],
      period: 'Last 5 months'
    },
    { 
      label: 'Time to First Share', 
      value: '3.2 min', 
      change: '-45%', 
      trend: 'up',
      category: 'engagement',
      description: 'Time from signup to first document share',
      chartData: [6.8, 5.9, 4.8, 3.9, 3.2],
      period: 'Last 5 months'
    },
    { 
      label: 'Customer Satisfaction', 
      value: '4.8/5', 
      change: '+0.4', 
      trend: 'up',
      category: 'engagement',
      description: 'Average customer rating and feedback',
      chartData: [4.2, 4.3, 4.5, 4.7, 4.8],
      period: 'Last 5 months'
    },
    { 
      label: 'Churn Rate', 
      value: '2.1%', 
      change: '-1.9%', 
      trend: 'up',
      category: 'financial',
      description: 'Monthly customer churn percentage',
      chartData: [5.2, 4.1, 3.3, 2.7, 2.1],
      period: 'Last 5 months'
    },
    { 
      label: 'API Requests', 
      value: '1.2M', 
      change: '+156%', 
      trend: 'up',
      category: 'engagement',
      description: 'Monthly API calls from integrations',
      chartData: [380000, 520000, 680000, 920000, 1200000],
      period: 'Last 5 months'
    },
    { 
      label: 'Security Scans', 
      value: '0', 
      change: '0%', 
      trend: 'stable',
      category: 'financial',
      description: 'Security vulnerabilities detected',
      chartData: [0, 0, 0, 0, 0],
      period: 'Last 5 months'
    },
    { 
      label: 'Feature Adoption', 
      value: '73%', 
      change: '+28%', 
      trend: 'up',
      category: 'engagement',
      description: 'Users utilizing advanced features',
      chartData: [48, 54, 61, 67, 73],
      period: 'Last 5 months'
    },
    { 
      label: 'Mobile Usage', 
      value: '42%', 
      change: '+67%', 
      trend: 'up',
      category: 'engagement',
      description: 'Sessions from mobile devices',
      chartData: [18, 23, 29, 36, 42],
      period: 'Last 5 months'
    },
    { 
      label: 'Data Transfer', 
      value: '847 GB', 
      change: '+123%', 
      trend: 'up',
      category: 'engagement',
      description: 'Monthly data transferred through platform',
      chartData: [280, 380, 520, 680, 847],
      period: 'Last 5 months'
    },
    { 
      label: 'Conversion Rate', 
      value: '18.4%', 
      change: '+23%', 
      trend: 'up',
      category: 'revenue',
      description: 'Trial to paid conversion percentage',
      chartData: [12.8, 14.2, 15.7, 17.1, 18.4],
      period: 'Last 5 months'
    },
    { 
      label: 'Support Response', 
      value: '12 min', 
      change: '-38%', 
      trend: 'up',
      category: 'engagement',
      description: 'Average first response time',
      chartData: [28, 23, 18, 15, 12],
      period: 'Last 5 months'
    },
    { 
      label: 'Enterprise Deals', 
      value: '23', 
      change: '+92%', 
      trend: 'up',
      category: 'revenue',
      description: 'Enterprise contracts signed',
      chartData: [8, 11, 14, 18, 23],
      period: 'Last 5 months'
    },
    { 
      label: 'Referral Revenue', 
      value: '$12K', 
      change: '+145%', 
      trend: 'up',
      category: 'revenue',
      description: 'Revenue from customer referrals',
      chartData: [3200, 4800, 6800, 9200, 12000],
      period: 'Last 5 months'
    },
    { 
      label: 'Page Load Time', 
      value: '0.8s', 
      change: '-35%', 
      trend: 'up',
      category: 'financial',
      description: 'Average page load performance',
      chartData: [1.4, 1.2, 1.0, 0.9, 0.8],
      period: 'Last 5 months'
    },
    { 
      label: 'Integration Usage', 
      value: '67%', 
      change: '+89%', 
      trend: 'up',
      category: 'engagement',
      description: 'Customers using third-party integrations',
      chartData: [28, 35, 45, 56, 67],
      period: 'Last 5 months'
    },
    { 
      label: 'Fundraising Success', 
      value: '89%', 
      change: '+12%', 
      trend: 'up',
      category: 'engagement',
      description: 'Customers who successfully raised funding',
      chartData: [76, 79, 83, 86, 89],
      period: 'Last 5 months'
    },
    { 
      label: 'Team Collaboration', 
      value: '4.2', 
      change: '+31%', 
      trend: 'up',
      category: 'engagement',
      description: 'Average team members per data room',
      chartData: [2.8, 3.1, 3.5, 3.9, 4.2],
      period: 'Last 5 months'
    }
  ],
  documents: [
    {
      id: '1',
      name: 'DataVault Pitch Deck 2024.pdf',
      type: 'PDF',
      size: '4.2 MB',
      lastModified: '2024-12-15',
      category: 'company',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/datavault-pitch-deck.pdf',
      pinned: true
    },
    {
      id: '2',
      name: 'Financial Model & Projections.xlsx',
      type: 'Excel',
      size: '2.1 MB',
      lastModified: '2024-12-12',
      category: 'financial',
      accessLevel: 'confidential',
      status: 'active',
      url: 'https://example.com/financial-model.xlsx',
      pinned: false
    },
    {
      id: '3',
      name: 'Product Demo & Walkthrough.mp4',
      type: 'Video',
      size: '45.8 MB',
      lastModified: '2024-12-10',
      category: 'product',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/product-demo.mp4',
      pinned: true
    },
    {
      id: '4',
      name: 'Market Analysis & Competitive Landscape.pdf',
      type: 'PDF',
      size: '6.3 MB',
      lastModified: '2024-12-08',
      category: 'market',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/market-analysis.pdf',
      pinned: false
    },
    {
      id: '5',
      name: 'Technical Architecture & Security.pdf',
      type: 'PDF',
      size: '3.7 MB',
      lastModified: '2024-12-05',
      category: 'product',
      accessLevel: 'restricted',
      status: 'active',
      url: 'https://example.com/technical-architecture.pdf',
      pinned: false
    },
    {
      id: '6',
      name: 'Customer Case Studies.pdf',
      type: 'PDF',
      size: '5.1 MB',
      lastModified: '2024-12-03',
      category: 'company',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/case-studies.pdf',
      pinned: true
    },
    {
      id: '7',
      name: 'Legal Documents & Compliance.pdf',
      type: 'PDF',
      size: '8.9 MB',
      lastModified: '2024-12-01',
      category: 'legal',
      accessLevel: 'confidential',
      status: 'active',
      url: 'https://example.com/legal-docs.pdf',
      pinned: false
    },
    {
      id: '8',
      name: 'Team Bios & Advisory Board.pdf',
      type: 'PDF',
      size: '2.8 MB',
      lastModified: '2024-11-28',
      category: 'company',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/team-bios.pdf',
      pinned: false
    }
  ],
  users: [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@bessemer.com',
      role: 'Lead Investor',
      lastAccess: '2024-12-15',
      documentsAccessed: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Torres',
      email: 'mike@firstround.com',
      role: 'Partner',
      lastAccess: '2024-12-14',
      documentsAccessed: 8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@angelinvestor.com',
      role: 'Angel Investor',
      lastAccess: '2024-12-13',
      documentsAccessed: 6,
      status: 'active'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@legalfirm.com',
      role: 'Legal Counsel',
      lastAccess: '2024-12-10',
      documentsAccessed: 15,
      status: 'pending'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@techvc.com',
      role: 'Investment Associate',
      lastAccess: '2024-12-09',
      documentsAccessed: 4,
      status: 'active'
    }
  ]
};