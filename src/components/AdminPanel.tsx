import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  FileText, 
  BarChart3, 
  Building, 
  DollarSign, 
  Target, 
  Shield, 
  PieChart,
  Save,
  Check,
  Clock,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { CompanyData } from '../types';
import { Button } from './ui/button';
import { DocumentManager } from './DocumentManager';
import { MetricsChart } from './MetricsChart';

interface AdminPanelProps {
  companyData: CompanyData;
  onUpdateData: (data: CompanyData) => void;
  onSignOut: () => void;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  companyData, 
  onUpdateData, 
  onSignOut 
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [localData, setLocalData] = useState<CompanyData>(companyData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Update local data when companyData changes
  useEffect(() => {
    setLocalData(companyData);
  }, [companyData]);

  // Autosave functionality
  const handleDataChange = (newData: CompanyData) => {
    setLocalData(newData);
    setSaveStatus('unsaved');

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for autosave
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      onUpdateData(newData);
      
      // Simulate save delay
      setTimeout(() => {
        setSaveStatus('saved');
      }, 500);
    }, 1000); // Save after 1 second of inactivity
  };

  // Helper function to update nested data
  const updateNestedData = (path: string[], value: any) => {
    const newData = { ...localData };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    handleDataChange(newData);
  };

  // Helper functions for array operations
  const addArrayItem = (path: string[], newItem: any) => {
    const newData = { ...localData };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = [...current[path[path.length - 1]], newItem];
    handleDataChange(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    const newData = { ...localData };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = current[path[path.length - 1]].filter((_: any, i: number) => i !== index);
    handleDataChange(newData);
  };

  const sections = [
    { id: "overview", name: "Overview", icon: Building },
    { id: "financials", name: "Financials", icon: DollarSign },
    { id: "market", name: "Market", icon: Target },
    { id: "team", name: "Team", icon: Users },
    { id: "product", name: "Product", icon: BarChart3 },
    { id: "legal", name: "Legal", icon: Shield },
    { id: "funding", name: "Funding", icon: PieChart },
    { id: "metrics", name: "Metrics", icon: BarChart3 },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saved':
        return <Check size={16} className="text-green-600" />;
      case 'saving':
        return <Clock size={16} className="text-yellow-600 animate-pulse" />;
      case 'unsaved':
        return <Save size={16} className="text-orange-600" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saved':
        return 'Saved';
      case 'saving':
        return 'Saving...';
      case 'unsaved':
        return 'Unsaved';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Company Overview</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Company Name</label>
              <input
                type="text"
                value={localData.overview.name}
                onChange={(e) => updateNestedData(['overview', 'name'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Description</label>
              <textarea
                value={localData.overview.description}
                onChange={(e) => updateNestedData(['overview', 'description'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-24 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Founded</label>
              <input
                type="text"
                value={localData.overview.founded}
                onChange={(e) => updateNestedData(['overview', 'founded'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Location</label>
              <input
                type="text"
                value={localData.overview.location}
                onChange={(e) => updateNestedData(['overview', 'location'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Stage</label>
              <input
                type="text"
                value={localData.overview.stage}
                onChange={(e) => updateNestedData(['overview', 'stage'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Industry</label>
              <input
                type="text"
                value={localData.overview.industry}
                onChange={(e) => updateNestedData(['overview', 'industry'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">ARR</label>
              <input
                type="text"
                value={localData.overview.arr}
                onChange={(e) => updateNestedData(['overview', 'arr'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Customers</label>
              <input
                type="text"
                value={localData.overview.customers}
                onChange={(e) => updateNestedData(['overview', 'customers'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Mission Statement</label>
            <textarea
              value={localData.overview.mission}
              onChange={(e) => updateNestedData(['overview', 'mission'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-32 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Vision</label>
            <textarea
              value={localData.overview.vision}
              onChange={(e) => updateNestedData(['overview', 'vision'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-24 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Values</label>
            <textarea
              value={localData.overview.values}
              onChange={(e) => updateNestedData(['overview', 'values'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-24 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Financial Overview</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Annual Revenue</label>
              <input
                type="text"
                value={localData.financials.annualRevenue}
                onChange={(e) => updateNestedData(['financials', 'annualRevenue'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Monthly Burn</label>
              <input
                type="text"
                value={localData.financials.monthlyBurn}
                onChange={(e) => updateNestedData(['financials', 'monthlyBurn'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Runway</label>
              <input
                type="text"
                value={localData.financials.runway}
                onChange={(e) => updateNestedData(['financials', 'runway'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Gross Margin</label>
              <input
                type="text"
                value={localData.financials.grossMargin}
                onChange={(e) => updateNestedData(['financials', 'grossMargin'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Revenue ($)</label>
              <input
                type="number"
                value={localData.financials.revenue}
                onChange={(e) => updateNestedData(['financials', 'revenue'], parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">COGS ($)</label>
              <input
                type="number"
                value={localData.financials.cogs}
                onChange={(e) => updateNestedData(['financials', 'cogs'], parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Operating Expenses ($)</label>
              <input
                type="number"
                value={localData.financials.operatingExpenses}
                onChange={(e) => updateNestedData(['financials', 'operatingExpenses'], parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Cash Balance ($)</label>
              <input
                type="number"
                value={localData.financials.cashBalance}
                onChange={(e) => updateNestedData(['financials', 'cashBalance'], parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Market Analysis</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">TAM</label>
            <input
              type="text"
              value={localData.market.tam}
              onChange={(e) => updateNestedData(['market', 'tam'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">SAM</label>
            <input
              type="text"
              value={localData.market.sam}
              onChange={(e) => updateNestedData(['market', 'sam'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">SOM</label>
            <input
              type="text"
              value={localData.market.som}
              onChange={(e) => updateNestedData(['market', 'som'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-[#B74B28]">Market Trends</label>
              <button
                onClick={() => addArrayItem(['market', 'trends'], '')}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Trend
              </button>
            </div>
            <div className="space-y-2">
              {localData.market.trends.map((trend, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={trend}
                    onChange={(e) => {
                      const newTrends = [...localData.market.trends];
                      newTrends[index] = e.target.value;
                      updateNestedData(['market', 'trends'], newTrends);
                    }}
                    className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                  <button
                    onClick={() => removeArrayItem(['market', 'trends'], index)}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-[#B74B28]">Competitors</label>
              <button
                onClick={() => addArrayItem(['market', 'competitors'], { name: '', type: 'Direct', description: '' })}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Competitor
              </button>
            </div>
            <div className="space-y-3">
              {localData.market.competitors.map((competitor, index) => (
                <div key={index} className="p-3 bg-white rounded-[8px] border-2 border-black space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={competitor.name}
                      onChange={(e) => {
                        const newCompetitors = [...localData.market.competitors];
                        newCompetitors[index] = { ...competitor, name: e.target.value };
                        updateNestedData(['market', 'competitors'], newCompetitors);
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      placeholder="Competitor name"
                    />
                    <button
                      onClick={() => removeArrayItem(['market', 'competitors'], index)}
                      className="p-1 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <select
                    value={competitor.type}
                    onChange={(e) => {
                      const newCompetitors = [...localData.market.competitors];
                      newCompetitors[index] = { ...competitor, type: e.target.value };
                      updateNestedData(['market', 'competitors'], newCompetitors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="Direct">Direct</option>
                    <option value="Indirect">Indirect</option>
                  </select>
                  <input
                    type="text"
                    value={competitor.description}
                    onChange={(e) => {
                      const newCompetitors = [...localData.market.competitors];
                      newCompetitors[index] = { ...competitor, description: e.target.value };
                      updateNestedData(['market', 'competitors'], newCompetitors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Legal Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Entity Type</label>
              <input
                type="text"
                value={localData.legal.entityType}
                onChange={(e) => updateNestedData(['legal', 'entityType'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Incorporation Date</label>
              <input
                type="text"
                value={localData.legal.incorporationDate}
                onChange={(e) => updateNestedData(['legal', 'incorporationDate'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">EIN</label>
              <input
                type="text"
                value={localData.legal.ein}
                onChange={(e) => updateNestedData(['legal', 'ein'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Address</label>
              <textarea
                value={localData.legal.address}
                onChange={(e) => updateNestedData(['legal', 'address'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-24 resize-none"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-[#B74B28]">Compliance Standards</label>
                <button
                  onClick={() => addArrayItem(['legal', 'compliance'], '')}
                  className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
                >
                  <Plus size={14} />
                  Add Standard
                </button>
              </div>
              <div className="space-y-2">
                {localData.legal.compliance.map((compliance, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={compliance}
                      onChange={(e) => {
                        const newCompliance = [...localData.legal.compliance];
                        newCompliance[index] = e.target.value;
                        updateNestedData(['legal', 'compliance'], newCompliance);
                      }}
                      className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    />
                    <button
                      onClick={() => removeArrayItem(['legal', 'compliance'], index)}
                      className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-[#B74B28]">Intellectual Property</label>
                <button
                  onClick={() => addArrayItem(['legal', 'intellectualProperty'], { type: 'Patent', name: '', status: 'Filed' })}
                  className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
                >
                  <Plus size={14} />
                  Add IP
                </button>
              </div>
              <div className="space-y-3">
                {localData.legal.intellectualProperty.map((ip, index) => (
                  <div key={index} className="p-3 bg-white rounded-[8px] border-2 border-black space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={ip.type}
                        onChange={(e) => {
                          const newIP = [...localData.legal.intellectualProperty];
                          newIP[index] = { ...ip, type: e.target.value };
                          updateNestedData(['legal', 'intellectualProperty'], newIP);
                        }}
                        className="p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="Patent">Patent</option>
                        <option value="Trademark">Trademark</option>
                        <option value="Copyright">Copyright</option>
                      </select>
                      <button
                        onClick={() => removeArrayItem(['legal', 'intellectualProperty'], index)}
                        className="p-1 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ip.name}
                      onChange={(e) => {
                        const newIP = [...localData.legal.intellectualProperty];
                        newIP[index] = { ...ip, name: e.target.value };
                        updateNestedData(['legal', 'intellectualProperty'], newIP);
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="IP name"
                    />
                    <select
                      value={ip.status}
                      onChange={(e) => {
                        const newIP = [...localData.legal.intellectualProperty];
                        newIP[index] = { ...ip, status: e.target.value };
                        updateNestedData(['legal', 'intellectualProperty'], newIP);
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="Filed">Filed</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Funding Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Total Raised</label>
              <input
                type="text"
                value={localData.funding.totalRaised}
                onChange={(e) => updateNestedData(['funding', 'totalRaised'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Current Round</label>
              <input
                type="text"
                value={localData.funding.currentRound}
                onChange={(e) => updateNestedData(['funding', 'currentRound'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Target Amount</label>
              <input
                type="text"
                value={localData.funding.targetAmount}
                onChange={(e) => updateNestedData(['funding', 'targetAmount'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Valuation</label>
              <input
                type="text"
                value={localData.funding.valuation}
                onChange={(e) => updateNestedData(['funding', 'valuation'], e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Use of Funds</label>
            <textarea
              value={localData.funding.useOfFunds}
              onChange={(e) => updateNestedData(['funding', 'useOfFunds'], e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] h-48 resize-none"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-[#B74B28]">Investors</label>
            <button
              onClick={() => addArrayItem(['funding', 'investors'], { name: '', type: 'VC', amount: '' })}
              className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
            >
              <Plus size={14} />
              Add Investor
            </button>
          </div>
          <div className="space-y-3">
            {localData.funding.investors.map((investor, index) => (
              <div key={index} className="p-3 bg-white rounded-[8px] border-2 border-black">
                <div className="grid grid-cols-4 gap-3 items-center">
                  <input
                    type="text"
                    value={investor.name}
                    onChange={(e) => {
                      const newInvestors = [...localData.funding.investors];
                      newInvestors[index] = { ...investor, name: e.target.value };
                      updateNestedData(['funding', 'investors'], newInvestors);
                    }}
                    className="p-2 border border-gray-300 rounded text-sm"
                    placeholder="Investor name"
                  />
                  <select
                    value={investor.type}
                    onChange={(e) => {
                      const newInvestors = [...localData.funding.investors];
                      newInvestors[index] = { ...investor, type: e.target.value };
                      updateNestedData(['funding', 'investors'], newInvestors);
                    }}
                    className="p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="VC">VC</option>
                    <option value="Angel">Angel</option>
                    <option value="Strategic">Strategic</option>
                  </select>
                  <input
                    type="text"
                    value={investor.amount}
                    onChange={(e) => {
                      const newInvestors = [...localData.funding.investors];
                      newInvestors[index] = { ...investor, amount: e.target.value };
                      updateNestedData(['funding', 'investors'], newInvestors);
                    }}
                    className="p-2 border border-gray-300 rounded text-sm"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => removeArrayItem(['funding', 'investors'], index)}
                    className="p-2 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Team Management</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#B74B28]">Leadership Team</h3>
              <button
                onClick={() => addArrayItem(['team', 'leadership'], { name: '', role: '', background: '' })}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Member
              </button>
            </div>
            <div className="space-y-4">
              {localData.team.leadership.map((member, index) => (
                <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#B74B28]">Member {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem(['team', 'leadership'], index)}
                      className="p-1 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const newLeadership = [...localData.team.leadership];
                      newLeadership[index] = { ...member, name: e.target.value };
                      updateNestedData(['team', 'leadership'], newLeadership);
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => {
                      const newLeadership = [...localData.team.leadership];
                      newLeadership[index] = { ...member, role: e.target.value };
                      updateNestedData(['team', 'leadership'], newLeadership);
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    placeholder="Role"
                  />
                  <textarea
                    value={member.background}
                    onChange={(e) => {
                      const newLeadership = [...localData.team.leadership];
                      newLeadership[index] = { ...member, background: e.target.value };
                      updateNestedData(['team', 'leadership'], newLeadership);
                    }}
                    className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
                    placeholder="Background"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#B74B28]">Advisory Board</h3>
              <button
                onClick={() => addArrayItem(['team', 'advisors'], { name: '', background: '' })}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Advisor
              </button>
            </div>
            <div className="space-y-4">
              {localData.team.advisors.map((advisor, index) => (
                <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#B74B28]">Advisor {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem(['team', 'advisors'], index)}
                      className="p-1 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={advisor.name}
                    onChange={(e) => {
                      const newAdvisors = [...localData.team.advisors];
                      newAdvisors[index] = { ...advisor, name: e.target.value };
                      updateNestedData(['team', 'advisors'], newAdvisors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    placeholder="Name"
                  />
                  <textarea
                    value={advisor.background}
                    onChange={(e) => {
                      const newAdvisors = [...localData.team.advisors];
                      newAdvisors[index] = { ...advisor, background: e.target.value };
                      updateNestedData(['team', 'advisors'], newAdvisors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded h-20 resize-none"
                    placeholder="Background"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Statistics */}
        <div className="mt-8 p-6 bg-white rounded-[10px] border-2 border-black">
          <h3 className="text-xl font-bold text-[#B74B28] mb-4">Team Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Total Employees</label>
              <input
                type="number"
                value={localData.team.totalEmployees}
                onChange={(e) => updateNestedData(['team', 'totalEmployees'], parseInt(e.target.value) || 0)}
                className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Engineering</label>
              <input
                type="number"
                value={localData.team.engineering}
                onChange={(e) => updateNestedData(['team', 'engineering'], parseInt(e.target.value) || 0)}
                className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Sales & Marketing</label>
              <input
                type="number"
                value={localData.team.salesMarketing}
                onChange={(e) => updateNestedData(['team', 'salesMarketing'], parseInt(e.target.value) || 0)}
                className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Operations</label>
              <input
                type="number"
                value={localData.team.operations}
                onChange={(e) => updateNestedData(['team', 'operations'], parseInt(e.target.value) || 0)}
                className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProduct = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Product Management</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#B74B28]">Core Features</h3>
              <button
                onClick={() => addArrayItem(['product', 'features'], '')}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {localData.product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...localData.product.features];
                      newFeatures[index] = e.target.value;
                      updateNestedData(['product', 'features'], newFeatures);
                    }}
                    className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                  <button
                    onClick={() => removeArrayItem(['product', 'features'], index)}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#B74B28]">Technology Stack</h3>
              <button
                onClick={() => addArrayItem(['product', 'techStack'], '')}
                className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Tech
              </button>
            </div>
            <div className="space-y-2">
              {localData.product.techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => {
                      const newTechStack = [...localData.product.techStack];
                      newTechStack[index] = e.target.value;
                      updateNestedData(['product', 'techStack'], newTechStack);
                    }}
                    className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                  <button
                    onClick={() => removeArrayItem(['product', 'techStack'], index)}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Roadmap */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#B74B28]">Product Roadmap</h3>
            <button
              onClick={() => addArrayItem(['product', 'roadmap'], { quarter: '', features: [], status: 'Planned' })}
              className="flex items-center gap-1 px-3 py-1 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black text-sm font-medium hover:bg-[#B74B28] hover:text-white transition-colors"
            >
              <Plus size={14} />
              Add Quarter
            </button>
          </div>
          <div className="space-y-4">
            {localData.product.roadmap.map((roadmap, index) => (
              <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={roadmap.quarter}
                    onChange={(e) => {
                      const newRoadmap = [...localData.product.roadmap];
                      newRoadmap[index] = { ...roadmap, quarter: e.target.value };
                      updateNestedData(['product', 'roadmap'], newRoadmap);
                    }}
                    className="p-2 border border-gray-300 rounded font-bold"
                    placeholder="Quarter (e.g., Q1 2025)"
                  />
                  <select
                    value={roadmap.status}
                    onChange={(e) => {
                      const newRoadmap = [...localData.product.roadmap];
                      newRoadmap[index] = { ...roadmap, status: e.target.value };
                      updateNestedData(['product', 'roadmap'], newRoadmap);
                    }}
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={() => removeArrayItem(['product', 'roadmap'], index)}
                    className="p-2 bg-red-500 text-white rounded border border-black hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#B74B28]">Features</label>
                    <button
                      onClick={() => {
                        const newRoadmap = [...localData.product.roadmap];
                        newRoadmap[index] = { ...roadmap, features: [...roadmap.features, ''] };
                        updateNestedData(['product', 'roadmap'], newRoadmap);
                      }}
                      className="text-xs px-2 py-1 bg-[#fab049] text-[#B74B28] rounded border border-black"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  {roadmap.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newRoadmap = [...localData.product.roadmap];
                          const newFeatures = [...roadmap.features];
                          newFeatures[featureIndex] = e.target.value;
                          newRoadmap[index] = { ...roadmap, features: newFeatures };
                          updateNestedData(['product', 'roadmap'], newRoadmap);
                        }}
                        className="flex-1 p-1 border border-gray-300 rounded text-sm"
                        placeholder="Feature name"
                      />
                      <button
                        onClick={() => {
                          const newRoadmap = [...localData.product.roadmap];
                          const newFeatures = roadmap.features.filter((_, i) => i !== featureIndex);
                          newRoadmap[index] = { ...roadmap, features: newFeatures };
                          updateNestedData(['product', 'roadmap'], newRoadmap);
                        }}
                        className="p-1 bg-red-500 text-white rounded text-xs"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-8">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h2 className="text-2xl font-bold text-[#B74B28] mb-6">Key Performance Indicators</h2>
        <p className="text-[#73430C] mb-6">Real-time metrics showing platform growth and user engagement</p>
        <MetricsChart metrics={localData.metrics} />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-7xl mx-auto">
      <DocumentManager
        documents={localData.documents}
        onAddDocument={(document) => {
          const newDoc = { ...document, id: Date.now().toString() };
          const updatedData = { ...localData, documents: [...localData.documents, newDoc] };
          handleDataChange(updatedData);
        }}
        onUpdateDocument={(id, updates) => {
          const updatedData = {
            ...localData,
            documents: localData.documents.map(doc => 
              doc.id === id ? { ...doc, ...updates } : doc
            )
          };
          handleDataChange(updatedData);
        }}
        onDeleteDocument={(id) => {
          const updatedData = {
            ...localData,
            documents: localData.documents.filter(doc => doc.id !== id)
          };
          handleDataChange(updatedData);
        }}
        isAdmin={true}
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
      case 'funding':
        return renderFunding();
      case 'metrics':
        return renderMetrics();
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fab049] rounded-full border-4 border-black flex items-center justify-center transform -rotate-12">
            <Settings size={24} className="text-[#B74B28]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#B74B28] transform rotate-1">Admin Panel</h1>
            <p className="text-sm text-[#B74B28] opacity-75">DataVault Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-black ${
            saveStatus === 'saved' ? 'bg-green-100' : 
            saveStatus === 'saving' ? 'bg-yellow-100' : 'bg-orange-100'
          }`}>
            {getSaveStatusIcon()}
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-700' : 
              saveStatus === 'saving' ? 'text-yellow-700' : 'text-orange-700'
            }`}>
              {getSaveStatusText()}
            </span>
          </div>
          
          <Button onClick={onSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#FFF1D6] border-r-4 border-black min-h-screen p-6">
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
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </nav>
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
                  <h1 className="text-3xl md:text-4xl font-bold text-[#B74B28]">
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
    </div>
  );
};