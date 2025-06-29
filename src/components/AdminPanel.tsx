import React, { useState, useCallback, useRef } from 'react';
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Save, 
  Plus, 
  Trash2, 
  Building,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  PieChart,
  LogOut
} from 'lucide-react';
import { CompanyData } from '../types';
import { Button } from './ui/button';
import { DocumentManager } from './DocumentManager';

interface AdminPanelProps {
  companyData: CompanyData;
  onUpdateData: (data: CompanyData) => void;
  onSignOut: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  companyData, 
  onUpdateData, 
  onSignOut 
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localData, setLocalData] = useState<CompanyData>(companyData);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sections = [
    { id: "overview", name: "Overview", icon: Building },
    { id: "financials", name: "Financials", icon: DollarSign },
    { id: "market", name: "Market", icon: Target },
    { id: "team", name: "Team", icon: Users },
    { id: "product", name: "Product", icon: TrendingUp },
    { id: "legal", name: "Legal", icon: Shield },
    { id: "funding", name: "Funding", icon: PieChart },
    { id: "metrics", name: "Metrics", icon: BarChart3 },
    { id: "documents", name: "Documents", icon: FileText },
  ];

  // Auto-save function with debouncing
  const autoSave = useCallback((newData: CompanyData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      onUpdateData(newData);
      setHasUnsavedChanges(false);
    }, 1000); // Save after 1 second of no changes
  }, [onUpdateData]);

  const updateLocalData = useCallback((updates: Partial<CompanyData>) => {
    const newData = { ...localData, ...updates };
    setLocalData(newData);
    setHasUnsavedChanges(true);
    autoSave(newData);
  }, [localData, autoSave]);

  const updateNestedData = useCallback((section: keyof CompanyData, updates: any) => {
    const newData = {
      ...localData,
      [section]: { ...localData[section], ...updates }
    };
    setLocalData(newData);
    setHasUnsavedChanges(true);
    autoSave(newData);
  }, [localData, autoSave]);

  const handleAddDocument = (document: any) => {
    const newDoc = {
      ...document,
      id: Date.now().toString(),
    };
    
    const newData = {
      ...localData,
      documents: [...localData.documents, newDoc]
    };
    
    setLocalData(newData);
    onUpdateData(newData);
  };

  const handleUpdateDocument = (id: string, updates: any) => {
    const newData = {
      ...localData,
      documents: localData.documents.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    };
    
    setLocalData(newData);
    onUpdateData(newData);
  };

  const handleDeleteDocument = (id: string) => {
    const newData = {
      ...localData,
      documents: localData.documents.filter(doc => doc.id !== id)
    };
    
    setLocalData(newData);
    onUpdateData(newData);
  };

  const renderOverviewEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Company Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Company Name</label>
              <input
                type="text"
                value={localData.overview.name}
                onChange={(e) => updateNestedData('overview', { name: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Description</label>
              <textarea
                value={localData.overview.description}
                onChange={(e) => updateNestedData('overview', { description: e.target.value })}
                rows={3}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Founded</label>
              <input
                type="text"
                value={localData.overview.founded}
                onChange={(e) => updateNestedData('overview', { founded: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Location</label>
              <input
                type="text"
                value={localData.overview.location}
                onChange={(e) => updateNestedData('overview', { location: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Stage</label>
              <select
                value={localData.overview.stage}
                onChange={(e) => updateNestedData('overview', { stage: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              >
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Growth">Growth</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Industry</label>
              <input
                type="text"
                value={localData.overview.industry}
                onChange={(e) => updateNestedData('overview', { industry: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">ARR</label>
              <input
                type="text"
                value={localData.overview.arr}
                onChange={(e) => updateNestedData('overview', { arr: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Customers</label>
              <input
                type="text"
                value={localData.overview.customers}
                onChange={(e) => updateNestedData('overview', { customers: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Team Size</label>
              <input
                type="text"
                value={localData.overview.teamSize}
                onChange={(e) => updateNestedData('overview', { teamSize: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Growth Rate</label>
              <input
                type="text"
                value={localData.overview.growthRate}
                onChange={(e) => updateNestedData('overview', { growthRate: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Mission & Vision</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Mission Statement</label>
            <textarea
              value={localData.overview.mission}
              onChange={(e) => updateNestedData('overview', { mission: e.target.value })}
              rows={4}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Vision</label>
            <textarea
              value={localData.overview.vision}
              onChange={(e) => updateNestedData('overview', { vision: e.target.value })}
              rows={3}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Values</label>
            <textarea
              value={localData.overview.values}
              onChange={(e) => updateNestedData('overview', { values: e.target.value })}
              rows={3}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Goals</label>
            <textarea
              value={localData.overview.goals}
              onChange={(e) => updateNestedData('overview', { goals: e.target.value })}
              rows={3}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialsEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Key Financial Metrics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Annual Revenue</label>
              <input
                type="text"
                value={localData.financials.annualRevenue}
                onChange={(e) => updateNestedData('financials', { annualRevenue: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Monthly Burn</label>
              <input
                type="text"
                value={localData.financials.monthlyBurn}
                onChange={(e) => updateNestedData('financials', { monthlyBurn: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Runway</label>
              <input
                type="text"
                value={localData.financials.runway}
                onChange={(e) => updateNestedData('financials', { runway: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Gross Margin</label>
              <input
                type="text"
                value={localData.financials.grossMargin}
                onChange={(e) => updateNestedData('financials', { grossMargin: e.target.value })}
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
                onChange={(e) => updateNestedData('financials', { revenue: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">COGS ($)</label>
              <input
                type="number"
                value={localData.financials.cogs}
                onChange={(e) => updateNestedData('financials', { cogs: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Operating Expenses ($)</label>
              <input
                type="number"
                value={localData.financials.operatingExpenses}
                onChange={(e) => updateNestedData('financials', { operatingExpenses: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Cash Balance ($)</label>
              <input
                type="number"
                value={localData.financials.cashBalance}
                onChange={(e) => updateNestedData('financials', { cashBalance: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Market Size</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">TAM</label>
            <input
              type="text"
              value={localData.market.tam}
              onChange={(e) => updateNestedData('market', { tam: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">SAM</label>
            <input
              type="text"
              value={localData.market.sam}
              onChange={(e) => updateNestedData('market', { sam: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">SOM</label>
            <input
              type="text"
              value={localData.market.som}
              onChange={(e) => updateNestedData('market', { som: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Market Trends</h3>
        <div className="space-y-3">
          {localData.market.trends.map((trend, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={trend}
                onChange={(e) => {
                  const newTrends = [...localData.market.trends];
                  newTrends[index] = e.target.value;
                  updateNestedData('market', { trends: newTrends });
                }}
                className="flex-1 p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
              <button
                onClick={() => {
                  const newTrends = localData.market.trends.filter((_, i) => i !== index);
                  updateNestedData('market', { trends: newTrends });
                }}
                className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newTrends = [...localData.market.trends, 'New trend'];
              updateNestedData('market', { trends: newTrends });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Trend
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Team Statistics</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Total Employees</label>
            <input
              type="number"
              value={localData.team.totalEmployees}
              onChange={(e) => updateNestedData('team', { totalEmployees: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Engineering</label>
            <input
              type="number"
              value={localData.team.engineering}
              onChange={(e) => updateNestedData('team', { engineering: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Sales & Marketing</label>
            <input
              type="number"
              value={localData.team.salesMarketing}
              onChange={(e) => updateNestedData('team', { salesMarketing: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Operations</label>
            <input
              type="number"
              value={localData.team.operations}
              onChange={(e) => updateNestedData('team', { operations: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Leadership Team</h3>
        <div className="space-y-4">
          {localData.team.leadership.map((member, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-white rounded-[10px] border-2 border-black">
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => {
                    const newLeadership = [...localData.team.leadership];
                    newLeadership[index] = { ...member, name: e.target.value };
                    updateNestedData('team', { leadership: newLeadership });
                  }}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Role</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => {
                    const newLeadership = [...localData.team.leadership];
                    newLeadership[index] = { ...member, role: e.target.value };
                    updateNestedData('team', { leadership: newLeadership });
                  }}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Background</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={member.background}
                    onChange={(e) => {
                      const newLeadership = [...localData.team.leadership];
                      newLeadership[index] = { ...member, background: e.target.value };
                      updateNestedData('team', { leadership: newLeadership });
                    }}
                    className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                  <button
                    onClick={() => {
                      const newLeadership = localData.team.leadership.filter((_, i) => i !== index);
                      updateNestedData('team', { leadership: newLeadership });
                    }}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              const newLeadership = [...localData.team.leadership, { name: '', role: '', background: '' }];
              updateNestedData('team', { leadership: newLeadership });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Team Member
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Product Features</h3>
        <div className="space-y-3">
          {localData.product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...localData.product.features];
                  newFeatures[index] = e.target.value;
                  updateNestedData('product', { features: newFeatures });
                }}
                className="flex-1 p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
              <button
                onClick={() => {
                  const newFeatures = localData.product.features.filter((_, i) => i !== index);
                  updateNestedData('product', { features: newFeatures });
                }}
                className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newFeatures = [...localData.product.features, 'New feature'];
              updateNestedData('product', { features: newFeatures });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Feature
          </button>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Technology Stack</h3>
        <div className="space-y-3">
          {localData.product.techStack.map((tech, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={tech}
                onChange={(e) => {
                  const newTechStack = [...localData.product.techStack];
                  newTechStack[index] = e.target.value;
                  updateNestedData('product', { techStack: newTechStack });
                }}
                className="flex-1 p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
              <button
                onClick={() => {
                  const newTechStack = localData.product.techStack.filter((_, i) => i !== index);
                  updateNestedData('product', { techStack: newTechStack });
                }}
                className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newTechStack = [...localData.product.techStack, 'New technology'];
              updateNestedData('product', { techStack: newTechStack });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Technology
          </button>
        </div>
      </div>
    </div>
  );

  const renderLegalEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Corporate Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Entity Type</label>
              <input
                type="text"
                value={localData.legal.entityType}
                onChange={(e) => updateNestedData('legal', { entityType: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Incorporation Date</label>
              <input
                type="text"
                value={localData.legal.incorporationDate}
                onChange={(e) => updateNestedData('legal', { incorporationDate: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">EIN</label>
              <input
                type="text"
                value={localData.legal.ein}
                onChange={(e) => updateNestedData('legal', { ein: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Address</label>
              <textarea
                value={localData.legal.address}
                onChange={(e) => updateNestedData('legal', { address: e.target.value })}
                rows={3}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Compliance Standards</h3>
        <div className="space-y-3">
          {localData.legal.compliance.map((compliance, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={compliance}
                onChange={(e) => {
                  const newCompliance = [...localData.legal.compliance];
                  newCompliance[index] = e.target.value;
                  updateNestedData('legal', { compliance: newCompliance });
                }}
                className="flex-1 p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
              <button
                onClick={() => {
                  const newCompliance = localData.legal.compliance.filter((_, i) => i !== index);
                  updateNestedData('legal', { compliance: newCompliance });
                }}
                className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newCompliance = [...localData.legal.compliance, 'New compliance standard'];
              updateNestedData('legal', { compliance: newCompliance });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Compliance Standard
          </button>
        </div>
      </div>
    </div>
  );

  const renderFundingEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Funding Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Total Raised</label>
              <input
                type="text"
                value={localData.funding.totalRaised}
                onChange={(e) => updateNestedData('funding', { totalRaised: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Current Round</label>
              <input
                type="text"
                value={localData.funding.currentRound}
                onChange={(e) => updateNestedData('funding', { currentRound: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Target Amount</label>
              <input
                type="text"
                value={localData.funding.targetAmount}
                onChange={(e) => updateNestedData('funding', { targetAmount: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Valuation</label>
              <input
                type="text"
                value={localData.funding.valuation}
                onChange={(e) => updateNestedData('funding', { valuation: e.target.value })}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Use of Funds</label>
              <textarea
                value={localData.funding.useOfFunds}
                onChange={(e) => updateNestedData('funding', { useOfFunds: e.target.value })}
                rows={4}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetricsEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000] p-6">
        <h3 className="text-2xl font-bold text-[#B74B28] mb-6">Key Performance Indicators</h3>
        <div className="space-y-4">
          {localData.metrics.map((metric, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-white rounded-[10px] border-2 border-black">
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Label</label>
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => {
                    const newMetrics = [...localData.metrics];
                    newMetrics[index] = { ...metric, label: e.target.value };
                    updateNestedData('metrics', newMetrics);
                  }}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Value</label>
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => {
                    const newMetrics = [...localData.metrics];
                    newMetrics[index] = { ...metric, value: e.target.value };
                    updateNestedData('metrics', newMetrics);
                  }}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Change</label>
                <input
                  type="text"
                  value={metric.change}
                  onChange={(e) => {
                    const newMetrics = [...localData.metrics];
                    newMetrics[index] = { ...metric, change: e.target.value };
                    updateNestedData('metrics', newMetrics);
                  }}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Trend</label>
                <div className="flex gap-2">
                  <select
                    value={metric.trend}
                    onChange={(e) => {
                      const newMetrics = [...localData.metrics];
                      newMetrics[index] = { ...metric, trend: e.target.value as any };
                      updateNestedData('metrics', newMetrics);
                    }}
                    className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  >
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="stable">Stable</option>
                  </select>
                  <button
                    onClick={() => {
                      const newMetrics = localData.metrics.filter((_, i) => i !== index);
                      updateLocalData({ metrics: newMetrics });
                    }}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              const newMetrics = [...localData.metrics, {
                label: 'New Metric',
                value: '0',
                change: '+0%',
                trend: 'stable' as const,
                category: 'revenue' as const,
                description: 'New metric description'
              }];
              updateLocalData({ metrics: newMetrics });
            }}
            className="flex items-center gap-2 p-3 bg-[#fab049] text-[#B74B28] rounded-[10px] border-2 border-black"
          >
            <Plus size={16} />
            Add Metric
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocumentsEditor = () => (
    <div className="max-w-7xl mx-auto">
      <DocumentManager
        documents={localData.documents}
        onAddDocument={handleAddDocument}
        onUpdateDocument={handleUpdateDocument}
        onDeleteDocument={handleDeleteDocument}
        isAdmin={true}
      />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewEditor();
      case 'financials':
        return renderFinancialsEditor();
      case 'market':
        return renderMarketEditor();
      case 'team':
        return renderTeamEditor();
      case 'product':
        return renderProductEditor();
      case 'legal':
        return renderLegalEditor();
      case 'funding':
        return renderFundingEditor();
      case 'metrics':
        return renderMetricsEditor();
      case 'documents':
        return renderDocumentsEditor();
      default:
        return renderOverviewEditor();
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
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 border-2 border-yellow-500 rounded-lg">
              <Save size={16} className="text-yellow-600" />
              <span className="text-sm text-yellow-600 font-medium">Auto-saving...</span>
            </div>
          )}
          <Button onClick={onSignOut} variant="outline" size="sm">
            <LogOut size={16} className="mr-2" />
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
                    Edit {sections.find((s) => s.id === activeSection)?.name}
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