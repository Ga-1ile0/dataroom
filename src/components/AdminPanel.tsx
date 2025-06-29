import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Clock
} from 'lucide-react';
import { CompanyData, User, Document, Metric } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  const [localData, setLocalData] = useState<CompanyData>(companyData);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (JSON.stringify(localData) !== JSON.stringify(companyData)) {
      setSaveStatus('unsaved');
      
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        setSaveStatus('saving');
        onUpdateData(localData);
        
        // Show saved status briefly
        setTimeout(() => {
          setSaveStatus('saved');
        }, 500);
      }, 1000); // Auto-save after 1 second of no changes
      
      setSaveTimeout(timeout);
    }
    
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [localData, companyData, onUpdateData, saveTimeout]);

  const updateLocalData = (updates: Partial<CompanyData>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  };

  const updateOverview = (field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      overview: { ...prev.overview, [field]: value }
    }));
  };

  const updateFinancials = (field: string, value: string | number) => {
    setLocalData(prev => ({
      ...prev,
      financials: { ...prev.financials, [field]: value }
    }));
  };

  const updateTeam = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      team: { ...prev.team, [field]: value }
    }));
  };

  const updateMarket = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      market: { ...prev.market, [field]: value }
    }));
  };

  const updateProduct = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      product: { ...prev.product, [field]: value }
    }));
  };

  const updateLegal = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      legal: { ...prev.legal, [field]: value }
    }));
  };

  const updateFunding = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      funding: { ...prev.funding, [field]: value }
    }));
  };

  const addMetric = () => {
    const newMetric: Metric = {
      label: 'New Metric',
      value: '0',
      change: '+0%',
      trend: 'stable',
      category: 'revenue',
      description: 'Description'
    };
    
    setLocalData(prev => ({
      ...prev,
      metrics: [...prev.metrics, newMetric]
    }));
  };

  const updateMetric = (index: number, field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const deleteMetric = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const addUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: 'New User',
      email: 'user@example.com',
      role: 'Investor',
      lastAccess: new Date().toISOString().split('T')[0],
      documentsAccessed: 0,
      status: 'pending'
    };
    
    setLocalData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const updateUser = (index: number, field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      users: prev.users.map((user, i) => 
        i === index ? { ...user, [field]: value } : user
      )
    }));
  };

  const deleteUser = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      users: prev.users.filter((_, i) => i !== index)
    }));
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: Building },
    { id: 'financials', name: 'Financials', icon: DollarSign },
    { id: 'market', name: 'Market', icon: Target },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'product', name: 'Product', icon: TrendingUp },
    { id: 'legal', name: 'Legal', icon: Shield },
    { id: 'funding', name: 'Funding', icon: PieChart },
    { id: 'metrics', name: 'Metrics', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
  ];

  const renderOverviewEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
        <h3 className="text-xl font-bold text-[#B74B28] mb-4">Company Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Company Name</label>
            <input
              type="text"
              value={localData.overview.name}
              onChange={(e) => updateOverview('name', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Industry</label>
            <input
              type="text"
              value={localData.overview.industry}
              onChange={(e) => updateOverview('industry', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Founded</label>
            <input
              type="text"
              value={localData.overview.founded}
              onChange={(e) => updateOverview('founded', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Location</label>
            <input
              type="text"
              value={localData.overview.location}
              onChange={(e) => updateOverview('location', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Stage</label>
            <input
              type="text"
              value={localData.overview.stage}
              onChange={(e) => updateOverview('stage', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Team Size</label>
            <input
              type="text"
              value={localData.overview.teamSize}
              onChange={(e) => updateOverview('teamSize', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-bold text-[#B74B28] mb-2">Description</label>
          <textarea
            value={localData.overview.description}
            onChange={(e) => updateOverview('description', e.target.value)}
            rows={3}
            className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-bold text-[#B74B28] mb-2">Mission</label>
          <textarea
            value={localData.overview.mission}
            onChange={(e) => updateOverview('mission', e.target.value)}
            rows={4}
            className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
          />
        </div>
      </div>
    </div>
  );

  const renderFinancialsEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
        <h3 className="text-xl font-bold text-[#B74B28] mb-4">Financial Metrics</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Annual Revenue</label>
            <input
              type="text"
              value={localData.financials.annualRevenue}
              onChange={(e) => updateFinancials('annualRevenue', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Monthly Burn</label>
            <input
              type="text"
              value={localData.financials.monthlyBurn}
              onChange={(e) => updateFinancials('monthlyBurn', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Runway</label>
            <input
              type="text"
              value={localData.financials.runway}
              onChange={(e) => updateFinancials('runway', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Gross Margin</label>
            <input
              type="text"
              value={localData.financials.grossMargin}
              onChange={(e) => updateFinancials('grossMargin', e.target.value)}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetricsEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#B74B28]">Metrics Management</h3>
          <Button onClick={addMetric} className="bg-[#fab049] text-[#B74B28]">
            <Plus size={16} className="mr-2" />
            Add Metric
          </Button>
        </div>
        
        <div className="space-y-4">
          {localData.metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#B74B28]">Metric {index + 1}</h4>
                <button
                  onClick={() => deleteMetric(index)}
                  className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Label</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, 'label', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Value</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, 'value', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Change</label>
                  <input
                    type="text"
                    value={metric.change}
                    onChange={(e) => updateMetric(index, 'change', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Trend</label>
                  <select
                    value={metric.trend}
                    onChange={(e) => updateMetric(index, 'trend', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  >
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="stable">Stable</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Description</label>
                <textarea
                  value={metric.description || ''}
                  onChange={(e) => updateMetric(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersEditor = () => (
    <div className="space-y-6">
      <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#B74B28]">User Management</h3>
          <Button onClick={addUser} className="bg-[#fab049] text-[#B74B28]">
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
        
        <div className="space-y-4">
          {localData.users.map((user, index) => (
            <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-[#B74B28]">{user.name}</h4>
                <button
                  onClick={() => deleteUser(index)}
                  className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => updateUser(index, 'name', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => updateUser(index, 'email', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Role</label>
                  <input
                    type="text"
                    value={user.role}
                    onChange={(e) => updateUser(index, 'role', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Status</label>
                  <select
                    value={user.status}
                    onChange={(e) => updateUser(index, 'status', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewEditor();
      case 'financials':
        return renderFinancialsEditor();
      case 'metrics':
        return renderMetricsEditor();
      case 'users':
        return renderUsersEditor();
      default:
        return (
          <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
            <h3 className="text-xl font-bold text-[#B74B28] mb-4">
              {sections.find(s => s.id === activeSection)?.name} Editor
            </h3>
            <p className="text-[#73430C]">Editor for this section is coming soon...</p>
          </div>
        );
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Clock size={16} className="text-yellow-600 animate-spin" />;
      case 'saved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'unsaved':
        return <Clock size={16} className="text-orange-600" />;
      default:
        return <CheckCircle size={16} className="text-green-600" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'unsaved':
        return 'Unsaved changes';
      default:
        return 'Saved';
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'saved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'unsaved':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
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
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${getSaveStatusColor()}`}>
            {getSaveStatusIcon()}
            <span className="text-sm font-medium">{getSaveStatusText()}</span>
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
          <div className="max-w-4xl mx-auto">
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