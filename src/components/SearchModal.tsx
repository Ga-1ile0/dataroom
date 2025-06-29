import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, TrendingUp, Users, DollarSign, Target, Shield, BarChart3, PieChart, Building } from 'lucide-react';
import { CompanyData, SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: CompanyData;
  onNavigate: (section: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose, 
  companyData, 
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const sectionIcons = {
    overview: Building,
    financials: DollarSign,
    market: Target,
    team: Users,
    product: TrendingUp,
    legal: Shield,
    metrics: BarChart3,
    funding: PieChart,
    documents: FileText
  };

  const searchData = useMemo(() => {
    const searchableContent: SearchResult[] = [];

    // Add documents
    companyData.documents.forEach(doc => {
      searchableContent.push({
        type: 'document',
        title: doc.name,
        description: `${doc.type} • ${doc.size} • ${doc.category}`,
        category: 'Documents',
        relevance: 0,
        data: { section: 'documents', doc }
      });
    });

    // Add sections and their content
    const sections = [
      {
        id: 'overview',
        name: 'Company Overview',
        content: [
          companyData.overview.name,
          companyData.overview.description,
          companyData.overview.mission,
          companyData.overview.vision,
          companyData.overview.values,
          companyData.overview.industry,
          companyData.overview.stage
        ].join(' ')
      },
      {
        id: 'financials',
        name: 'Financials',
        content: [
          companyData.financials.annualRevenue,
          companyData.financials.monthlyBurn,
          companyData.financials.runway,
          'revenue', 'expenses', 'cash flow', 'burn rate'
        ].join(' ')
      },
      {
        id: 'market',
        name: 'Market Analysis',
        content: [
          companyData.market.tam,
          companyData.market.sam,
          companyData.market.som,
          ...companyData.market.trends,
          ...companyData.market.competitors.map(c => `${c.name} ${c.description}`)
        ].join(' ')
      },
      {
        id: 'team',
        name: 'Team',
        content: [
          ...companyData.team.leadership.map(l => `${l.name} ${l.role} ${l.background}`),
          ...companyData.team.advisors.map(a => `${a.name} ${a.background}`),
          'leadership', 'advisors', 'employees'
        ].join(' ')
      },
      {
        id: 'product',
        name: 'Product',
        content: [
          ...companyData.product.features,
          ...companyData.product.techStack,
          'features', 'technology', 'roadmap', 'development'
        ].join(' ')
      },
      {
        id: 'legal',
        name: 'Legal',
        content: [
          companyData.legal.entityType,
          companyData.legal.incorporationDate,
          ...companyData.legal.compliance,
          'legal', 'compliance', 'intellectual property', 'patents', 'trademarks'
        ].join(' ')
      },
      {
        id: 'funding',
        name: 'Funding',
        content: [
          companyData.funding.totalRaised,
          companyData.funding.currentRound,
          companyData.funding.targetAmount,
          companyData.funding.valuation,
          ...companyData.funding.investors.map(i => `${i.name} ${i.type}`),
          'investment', 'valuation', 'investors', 'funding round'
        ].join(' ')
      },
      {
        id: 'metrics',
        name: 'Metrics',
        content: [
          ...companyData.metrics.map(m => `${m.label} ${m.value}`),
          'kpi', 'performance', 'analytics', 'growth'
        ].join(' ')
      }
    ];

    sections.forEach(section => {
      searchableContent.push({
        type: 'section',
        title: section.name,
        description: `View ${section.name.toLowerCase()} information`,
        category: 'Sections',
        relevance: 0,
        data: { section: section.id, content: section.content }
      });
    });

    return searchableContent;
  }, [companyData]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const query = searchTerm.toLowerCase();
    const searchResults = searchData
      .map(item => {
        let relevance = 0;
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        
        if (item.type === 'section' && item.data?.content) {
          const contentMatch = item.data.content.toLowerCase().includes(query);
          if (contentMatch) relevance += 1;
        }
        
        if (titleMatch) relevance += 3;
        if (descMatch) relevance += 2;
        
        // Boost exact matches
        if (item.title.toLowerCase() === query) relevance += 5;
        
        return { ...item, relevance };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);

    setResults(searchResults);
  }, [searchTerm, searchData]);

  const handleResultClick = (result: SearchResult) => {
    if (result.data?.section) {
      onNavigate(result.data.section);
      onClose();
    }
  };

  const getResultIcon = (result: SearchResult) => {
    if (result.type === 'document') {
      return FileText;
    }
    if (result.data?.section && sectionIcons[result.data.section as keyof typeof sectionIcons]) {
      return sectionIcons[result.data.section as keyof typeof sectionIcons];
    }
    return Search;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAB049] rounded-full border-3 border-black flex items-center justify-center">
              <Search size={20} className="text-[#B74B28]" />
            </div>
            <h2 className="text-3xl text-[#B74B28]">Search Data Room</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FAB049] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#B74B28]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b-2 border-black">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search documents, sections, or data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] text-xl"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchTerm && results.length === 0 && (
            <div className="p-6 text-center text-[#B74B28]">
              <p className="text-xl">No results found for "{searchTerm}"</p>
              <p className="text-lg text-gray-600 mt-2">Try searching for documents, team members, or financial data</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-4">
              <p className="text-lg text-[#B74B28] mb-4 px-2">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {results.map((result, index) => {
                  const IconComponent = getResultIcon(result);
                  return (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-4 p-4 bg-white rounded-[10px] border-2 border-black hover:bg-[#FAB049] transition-all duration-200 text-left group"
                    >
                      <div className="w-10 h-10 bg-[#FAB049] group-hover:bg-white rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
                        <IconComponent size={20} className="text-[#B74B28]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl text-[#B74B28] truncate">{result.title}</h3>
                        <p className="text-lg text-gray-600 truncate">{result.description}</p>
                        <span className="text-base text-[#B74B28] opacity-75">{result.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!searchTerm && (
            <div className="p-6">
              <h3 className="text-2xl text-[#B74B28] mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(sectionIcons).slice(0, 8).map(([section, IconComponent]) => (
                  <button
                    key={section}
                    onClick={() => {
                      onNavigate(section);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 bg-white rounded-[8px] border-2 border-black hover:bg-[#FAB049] transition-colors"
                  >
                    <IconComponent size={16} className="text-[#B74B28]" />
                    <span className="text-lg text-[#B74B28] capitalize">{section}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};