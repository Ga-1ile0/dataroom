import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Star, 
  Sparkles, 
  FileText, 
  Folder, 
  Users, 
  TrendingUp, 
  Lock, 
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Building,
  Shield,
  Calendar,
  Activity,
  Target,
  PieChart,
  LineChart,
  Pin
} from 'lucide-react';
import { CompanyData } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { SearchModal } from './SearchModal';
import { DocumentManager } from './DocumentManager';

interface DataRoomProps {
  companyData: CompanyData;
  isAdmin: boolean;
  onSignOut: () => void;
  onUpdateData: (data: CompanyData) => void;
}

export const DataRoom: React.FC<DataRoomProps> = ({ 
  companyData, 
  isAdmin, 
  onSignOut,
  onUpdateData 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const sections = [
    { id: "overview", name: "Overview", icon: Eye },
    { id: "financials", name: "Financials", icon: DollarSign },
    { id: "market", name: "Market", icon: Target },
    { id: "team", name: "Team", icon: Users },
    { id: "product", name: "Product", icon: TrendingUp },
    { id: "legal", name: "Legal", icon: Shield },
    { id: "metrics", name: "Metrics", icon: BarChart3 },
    { id: "funding", name: "Funding", icon: PieChart },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const categories = [
    { id: 'all', name: 'All Documents', icon: FileText, count: companyData.documents.length },
    { id: 'company', name: 'Company Overview', icon: Building, count: companyData.documents.filter(d => d.category === 'company').length },
    { id: 'financial', name: 'Financial', icon: DollarSign, count: companyData.documents.filter(d => d.category === 'financial').length },
    { id: 'legal', name: 'Legal', icon: Shield, count: companyData.documents.filter(d => d.category === 'legal').length },
    { id: 'product', name: 'Product', icon: Sparkles, count: companyData.documents.filter(d => d.category === 'product').length },
    { id: 'market', name: 'Market Research', icon: TrendingUp, count: companyData.documents.filter(d => d.category === 'market').length }
  ];

  const filteredDocuments = companyData.documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800 border-green-300';
      case 'restricted': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confidential': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleAddDocument = (document: any) => {
    const newDoc = {
      ...document,
      id: Date.now().toString(),
    };
    
    const updatedData = {
      ...companyData,
      documents: [...companyData.documents, newDoc]
    };
    
    onUpdateData(updatedData);
  };

  const handleUpdateDocument = (id: string, updates: any) => {
    const updatedData = {
      ...companyData,
      documents: companyData.documents.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    };
    
    onUpdateData(updatedData);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedData = {
      ...companyData,
      documents: companyData.documents.filter(doc => doc.id !== id)
    };
    
    onUpdateData(updatedData);
  };

  // Get pinned documents for quick access
  const pinnedDocuments = companyData.documents.filter(doc => doc.pinned);

  // Handle clicking on pinned documents
  const handlePinnedDocumentClick = (doc: any) => {
    if (doc.url) {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#FAB049] rounded-full border-4 border-black flex items-center justify-center">
            <Sparkles size={32} className="text-[#B74B28]" />
          </div>
          <div>
            <h2 className="text-4xl text-[#B74B28]">{companyData.overview.name}</h2>
            <p className="text-xl text-[#73430C]">{companyData.overview.description}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl text-[#B74B28] mb-3">Company Info</h3>
            <div className="space-y-2 text-[#73430C]">
              <p className="text-lg"><span className="text-[#B74B28]">Founded:</span> {companyData.overview.founded}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Location:</span> {companyData.overview.location}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Stage:</span> {companyData.overview.stage}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Industry:</span> {companyData.overview.industry}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-[#B74B28] mb-3">Key Metrics</h3>
            <div className="space-y-2 text-[#73430C]">
              <p className="text-lg"><span className="text-[#B74B28]">ARR:</span> {companyData.overview.arr}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Customers:</span> {companyData.overview.customers}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Team Size:</span> {companyData.overview.teamSize}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Growth Rate:</span> {companyData.overview.growthRate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-3xl text-[#B74B28] mb-4">Mission Statement</h3>
        <p className="text-xl text-[#73430C] leading-relaxed">{companyData.overview.mission}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Vision", content: companyData.overview.vision, color: "bg-[#7583FA]" },
          { title: "Values", content: companyData.overview.values, color: "bg-[#FAB049]" },
          { title: "Goals", content: companyData.overview.goals, color: "bg-[#9C6220]" },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
          >
            <h4 className="text-2xl mb-3">{item.title}</h4>
            <p className="text-base leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Financial Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Annual Revenue", value: companyData.financials.annualRevenue, growth: "+180%", color: "bg-[#7583FA]" },
            { label: "Monthly Burn", value: companyData.financials.monthlyBurn, growth: "-12%", color: "bg-[#FAB049]" },
            { label: "Runway", value: companyData.financials.runway, growth: "+3 months", color: "bg-[#9C6220]" },
            { label: "Gross Margin", value: companyData.financials.grossMargin, growth: "+5%", color: "bg-[#B74B28]" },
          ].map((metric, index) => (
            <div
              key={index}
              className={`${metric.color} rounded-[10px] border-3 border-black shadow-[4px_4px_0px_#000000] p-4 text-white transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <p className="text-base opacity-90">{metric.label}</p>
              <p className="text-3xl">{metric.value}</p>
              <p className="text-base">{metric.growth}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
          <h3 className="text-2xl text-[#B74B28] mb-4">P&L Summary (Last 12 Months)</h3>
          <div className="space-y-3 text-[#73430C]">
            <div className="flex justify-between">
              <span className="text-lg">Revenue</span>
              <span className="text-lg text-[#B74B28]">${companyData.financials.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg">COGS</span>
              <span className="text-lg text-[#B74B28]">${companyData.financials.cogs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg">Gross Profit</span>
              <span className="text-lg text-green-600">${companyData.financials.grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg">Operating Expenses</span>
              <span className="text-lg text-[#B74B28]">${companyData.financials.operatingExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#B74B28] pt-2">
              <span className="text-lg text-[#B74B28]">Net Income</span>
              <span className="text-lg text-green-600">${companyData.financials.netIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
          <h3 className="text-2xl text-[#B74B28] mb-4">Cash Flow</h3>
          <div className="space-y-3 text-[#73430C]">
            <div className="flex justify-between">
              <span className="text-lg">Operating Cash Flow</span>
              <span className="text-lg text-green-600">${companyData.financials.operatingCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg">Investing Cash Flow</span>
              <span className="text-lg text-red-600">${companyData.financials.investingCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg">Financing Cash Flow</span>
              <span className="text-lg text-green-600">${companyData.financials.financingCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#B74B28] pt-2">
              <span className="text-lg text-[#B74B28]">Net Cash Flow</span>
              <span className="text-lg text-green-600">${companyData.financials.netCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg text-[#B74B28]">Cash Balance</span>
              <span className="text-lg text-[#B74B28]">${companyData.financials.cashBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Market Analysis</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "TAM", value: companyData.market.tam, desc: "Total Addressable Market", color: "bg-[#7583FA]" },
            { title: "SAM", value: companyData.market.sam, desc: "Serviceable Addressable Market", color: "bg-[#FAB049]" },
            { title: "SOM", value: companyData.market.som, desc: "Serviceable Obtainable Market", color: "bg-[#9C6220]" },
          ].map((market, index) => (
            <div
              key={index}
              className={`${market.color} rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white text-center transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <h3 className="text-2xl mb-2">{market.title}</h3>
              <p className="text-3xl mb-2">{market.value}</p>
              <p className="text-base opacity-90">{market.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Competitive Landscape</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl text-[#73430C] mb-3">Key Competitors</h4>
            <div className="space-y-3">
              {companyData.market.competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#FAB049] rounded-[10px] border-2 border-black"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg text-[#B74B28]">{competitor.name}</span>
                    <Badge className={competitor.type === 'Direct' ? 'bg-[#B74B28] text-white' : 'bg-[#7583FA] text-white'}>
                      {competitor.type}
                    </Badge>
                  </div>
                  <p className="text-base text-[#73430C]">{competitor.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl text-[#73430C] mb-3">Market Trends</h4>
            <div className="space-y-3">
              {companyData.market.trends.map((trend, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-[#7583FA] rounded-[8px] border-2 border-black">
                  <TrendingUp size={16} className="text-white flex-shrink-0" />
                  <span className="text-white text-base">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Leadership Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyData.team.leadership.map((member, index) => (
            <div
              key={index}
              className={`bg-[#7583FA] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <div className="w-16 h-16 bg-white rounded-full border-3 border-black mx-auto mb-4 flex items-center justify-center">
                <Users size={24} className="text-[#B74B28]" />
              </div>
              <h3 className="text-xl text-center mb-2">{member.name}</h3>
              <p className="text-base text-center mb-2 opacity-90">{member.role}</p>
              <p className="text-sm text-center opacity-80">{member.background}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Team Statistics</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Total Employees", value: companyData.team.totalEmployees.toString(), color: "bg-[#7583FA]" },
            { label: "Engineering", value: companyData.team.engineering.toString(), color: "bg-[#FAB049]" },
            { label: "Sales & Marketing", value: companyData.team.salesMarketing.toString(), color: "bg-[#9C6220]" },
            { label: "Operations", value: companyData.team.operations.toString(), color: "bg-[#B74B28]" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-[10px] border-3 border-black shadow-[4px_4px_0px_#000000] p-4 text-white text-center transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <p className="text-3xl">{stat.value}</p>
              <p className="text-base opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Advisory Board</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {companyData.team.advisors.map((advisor, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-[#FAB049] rounded-[10px] border-2 border-black">
              <div className="w-12 h-12 bg-[#B74B28] rounded-full border-2 border-black flex items-center justify-center">
                <Star size={20} className="text-[#FAB049]" />
              </div>
              <div>
                <h4 className="text-lg text-[#B74B28]">{advisor.name}</h4>
                <p className="text-base text-[#73430C]">{advisor.background}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProduct = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Product Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl text-[#73430C] mb-4">Core Features</h3>
            <div className="space-y-3">
              {companyData.product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#FAB049] rounded-full border-2 border-black flex items-center justify-center">
                    <span className="text-sm text-[#B74B28]">✓</span>
                  </div>
                  <span className="text-[#73430C] text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-[#73430C] mb-4">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-3">
              {companyData.product.techStack.map((tech, index) => (
                <div
                  key={index}
                  className="bg-[#7583FA] text-white p-2 rounded-[8px] border-2 border-black text-center text-base"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Product Roadmap</h3>
        <div className="space-y-6">
          {companyData.product.roadmap.map((roadmap, index) => (
            <div
              key={index}
              className={`p-4 rounded-[10px] border-3 border-black ${index === 0 ? "bg-[#FAB049]" : "bg-[#7583FA]"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl text-white">{roadmap.quarter}</h4>
                <Badge className={`${index === 0 ? "bg-[#B74B28]" : "bg-white text-[#7583FA]"}`}>
                  {roadmap.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.features.map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="bg-white text-[#B74B28] px-3 py-1 rounded-[6px] border border-black text-base"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Legal Structure</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl text-[#73430C] mb-4">Corporate Information</h3>
            <div className="space-y-3 text-[#73430C]">
              <p className="text-lg"><span className="text-[#B74B28]">Entity Type:</span> {companyData.legal.entityType}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Incorporation Date:</span> {companyData.legal.incorporationDate}</p>
              <p className="text-lg"><span className="text-[#B74B28]">EIN:</span> {companyData.legal.ein}</p>
              <p className="text-lg"><span className="text-[#B74B28]">Address:</span> {companyData.legal.address}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-[#73430C] mb-4">Intellectual Property</h3>
            <div className="space-y-3">
              {companyData.legal.intellectualProperty.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#FAB049] rounded-[8px] border-2 border-black">
                  <div>
                    <span className="text-lg text-[#B74B28]">{ip.name}</span>
                    <p className="text-base text-[#73430C]">{ip.type}</p>
                  </div>
                  <Badge className="bg-[#B74B28] text-white">{ip.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Compliance & Certifications</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl text-[#73430C] mb-3">Compliance Standards</h4>
            <div className="space-y-2">
              {companyData.legal.compliance.map((compliance, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#7583FA] rounded-[8px] border-2 border-black"
                >
                  <Shield size={16} className="text-white" />
                  <span className="text-lg text-white">{compliance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Key Performance Indicators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyData.metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-[#7583FA] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white text-center transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <h3 className="text-xl mb-2">{metric.label}</h3>
              <p className="text-3xl mb-2">{metric.value}</p>
              <p className="text-base opacity-90">{metric.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h2 className="text-3xl text-[#B74B28] mb-6">Funding Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Total Raised", value: companyData.funding.totalRaised, desc: "To Date", color: "bg-[#7583FA]" },
            { title: "Current Round", value: companyData.funding.currentRound, desc: companyData.funding.targetAmount, color: "bg-[#FAB049]" },
            { title: "Valuation", value: companyData.funding.valuation, desc: "Pre-Money", color: "bg-[#9C6220]" },
          ].map((funding, index) => (
            <div
              key={index}
              className={`${funding.color} rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 text-white text-center transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <h3 className="text-2xl mb-2">{funding.title}</h3>
              <p className="text-3xl mb-2">{funding.value}</p>
              <p className="text-base opacity-90">{funding.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform -rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Investor Portfolio</h3>
        <div className="space-y-4">
          {companyData.funding.investors.map((investor, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#FAB049] rounded-[10px] border-2 border-black">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#B74B28] rounded-full border-2 border-black flex items-center justify-center">
                  <DollarSign size={20} className="text-[#FAB049]" />
                </div>
                <div>
                  <h4 className="text-lg text-[#B74B28]">{investor.name}</h4>
                  <p className="text-base text-[#73430C]">{investor.type} Investor</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg text-[#B74B28]">{investor.amount}</p>
                <Badge className="bg-[#B74B28] text-white">{investor.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6 transform rotate-1">
        <h3 className="text-2xl text-[#B74B28] mb-4">Use of Funds</h3>
        <p className="text-xl text-[#73430C] leading-relaxed">{companyData.funding.useOfFunds}</p>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-7xl mx-auto">
      <DocumentManager
        documents={companyData.documents}
        onAddDocument={handleAddDocument}
        onUpdateDocument={handleUpdateDocument}
        onDeleteDocument={handleDeleteDocument}
        isAdmin={isAdmin}
      />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'financials':
        return renderFinancials();
      case 'market':
        return renderMarket();
      case 'team':
        return renderTeam();
      case 'product':
        return renderProduct();
      case 'legal':
        return renderLegal();
      case 'metrics':
        return renderMetrics();
      case 'funding':
        return renderFunding();
      case 'documents':
        return renderDocuments();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-[#FAB049] min-h-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDYwIDAgTCAwIDYwIE0gMzAgMCBMIDAgMzAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjA1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPC9zdmc+')] bg-repeat">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#FFF1D6] h-20 md:h-24 flex items-center justify-between px-4 md:px-12 border-b-4 border-black">
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fab049] rounded-full border-4 border-black flex items-center justify-center transform -rotate-12">
            <Building size={24} className="text-[#B74B28]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl text-[#B74B28] transform rotate-1">DataVault</h1>
            <p className="text-base text-[#B74B28] opacity-75">{companyData.overview.name}</p>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs">Admin Mode</Badge>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg hover:bg-[#fab049] transition-colors"
          >
            <Search size={16} className="text-[#B74B28]" />
            <span className="text-[#B74B28] text-lg">Search</span>
          </button>
          
          {sections.slice(0, 4).map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg text-lg transition-all ${
                activeSection === section.id 
                  ? 'bg-[#fab049] text-[#B74B28] border-2 border-black shadow-[3px_3px_0px_#000000]' 
                  : 'text-[#B74B28] hover:bg-[#fab049] hover:bg-opacity-50'
              }`}
            >
              {section.name}
            </button>
          ))}
          <Button onClick={onSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FFF1D6] z-50 flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl text-[#B74B28] transform -rotate-3">DataVault</h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>

          {/* Mobile Search */}
          <button
            onClick={() => {
              setShowSearchModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 p-4 mb-4 bg-[#fab049] rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] text-[#B74B28]"
          >
            <Search size={20} />
            <span className="text-xl">Search Data Room</span>
          </button>

          <nav className="flex flex-col gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-4 text-xl bg-[#fab049] rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] text-[#B74B28]"
              >
                {section.name}
              </button>
            ))}
            <Button onClick={onSignOut} variant="outline" className="mt-4">
              Sign Out
            </Button>
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-[#FFF1D6] border-r-4 border-black min-h-screen p-6">
          <nav className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-[10px] border-2 border-black transition-all transform hover:scale-105 ${
                  activeSection === section.id
                    ? "bg-[#FAB049] text-[#B74B28] shadow-[3px_3px_0px_#000000] rotate-1"
                    : "bg-white text-[#73430C] hover:bg-[#FAB049] -rotate-1"
                }`}
              >
                <section.icon size={20} />
                <span className="text-lg">{section.name}</span>
              </button>
            ))}
          </nav>

          {/* Document Quick Access */}
          <div className="mt-8">
            <h3 className="text-xl text-[#B74B28] mb-4 transform rotate-1">📌 Pinned Documents</h3>
            <div className="space-y-2">
              {pinnedDocuments.length > 0 ? (
                pinnedDocuments.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handlePinnedDocumentClick(doc)}
                    className="w-full flex items-center gap-2 p-2 bg-white rounded-[8px] border-2 border-black hover:bg-[#FAB049] transition-colors cursor-pointer text-left"
                  >
                    <FileText size={16} className="text-[#B74B28] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-[#73430C] truncate">{doc.name}</p>
                      <p className="text-sm text-[#9C6220]">{doc.size}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Pin size={12} className="text-[#B74B28]" />
                      {doc.accessLevel === 'confidential' && <Lock size={12} className="text-[#B74B28]" />}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-base text-[#73430C] italic">No pinned documents</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <div className="bg-[#FFF1D6] p-4 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] transform rotate-1 inline-block">
                <div className="flex items-center gap-4">
                  {sections.find((s) => s.id === activeSection)?.icon && (
                    <div className="w-12 h-12 bg-[#FAB049] rounded-full border-3 border-black flex items-center justify-center">
                      {(() => {
                        const IconComponent = sections.find((s) => s.id === activeSection)?.icon;
                        return IconComponent ? <IconComponent size={24} className="text-[#B74B28]" /> : null;
                      })()}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-5xl text-[#B74B28]">
                    {sections.find((s) => s.id === activeSection)?.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Section Content */}
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        companyData={companyData}
        onNavigate={setActiveSection}
      />
    </div>
  );
};