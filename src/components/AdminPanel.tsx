import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Building,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Shield,
  PieChart,
  FileText,
  Plus,
  Trash2,
  Pin,
  PinOff
} from 'lucide-react';
import { CompanyData, Document } from '../types';
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
  const [editedData, setEditedData] = useState<CompanyData>(companyData);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;
    
    setSaveStatus('saving');
    try {
      await onUpdateData(editedData);
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [editedData, hasUnsavedChanges, onUpdateData]);

  // Auto-save every 3 seconds when there are changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(autoSave, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSave]);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(editedData) !== JSON.stringify(companyData);
    setHasUnsavedChanges(hasChanges);
  }, [editedData, companyData]);

  // Update edited data when company data changes
  useEffect(() => {
    setEditedData(companyData);
  }, [companyData]);

  const handleManualSave = () => {
    autoSave();
  };

  const updateField = (path: string, value: any) => {
    setEditedData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addMetric = () => {
    const newMetric = {
      label: 'New Metric',
      value: '0',
      change: '+0%',
      trend: 'stable' as const,
      category: 'revenue' as const,
      description: 'Description',
      chartData: [0, 0, 0, 0, 0]
    };
    
    setEditedData(prev => ({
      ...prev,
      metrics: [...prev.metrics, newMetric]
    }));
  };

  const removeMetric = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const updateMetric = (index: number, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const addDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: 'New Document',
      type: 'PDF',
      size: '1.0 MB',
      lastModified: new Date().toISOString().split('T')[0],
      category: 'company',
      accessLevel: 'public',
      status: 'active',
      url: 'https://example.com/document.pdf',
      pinned: false
    };
    
    setEditedData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  const removeDocument = (id: string) => {
    setEditedData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const updateDocument = (id: string, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
      case 'saved':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Save size={16} />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Error';
      default:
        return hasUnsavedChanges ? 'Save Changes' : 'All Saved';
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
          {/* Save Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black ${
            saveStatus === 'saved' ? 'bg-green-500 text-white' :
            saveStatus === 'error' ? 'bg-red-500 text-white' :
            saveStatus === 'saving' ? 'bg-blue-500 text-white' :
            hasUnsavedChanges ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-600'
          }`}>
            {getSaveStatusIcon()}
            <span className="font-medium text-sm">{getSaveStatusText()}</span>
          </div>

          {/* Manual Save Button */}
          <Button
            onClick={handleManualSave}
            disabled={!hasUnsavedChanges || saveStatus === 'saving'}
            className={`${hasUnsavedChanges ? 'bg-[#fab049] text-[#B74B28]' : 'bg-gray-300 text-gray-500'}`}
          >
            <Save size={16} className="mr-2" />
            Save Now
          </Button>

          <Button onClick={onSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Company Overview */}
        <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
          <div className="flex items-center gap-4 mb-6">
            <Building size={32} className="text-[#B74B28]" />
            <h2 className="text-3xl font-bold text-[#B74B28]">Company Overview</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Company Name</label>
                <input
                  type="text"
                  value={editedData.overview.name}
                  onChange={(e) => updateField('overview.name', e.target.value)}
                  className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">Description</label>
                <textarea
                  value={editedData.overview.description}
                  onChange={(e) => updateField('overview.description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Founded</label>
                  <input
                    type="text"
                    value={editedData.overview.founded}
                    onChange={(e) => updateField('overview.founded', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Location</label>
                  <input
                    type="text"
                    value={editedData.overview.location}
                    onChange={(e) => updateField('overview.location', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Stage</label>
                  <select
                    value={editedData.overview.stage}
                    onChange={(e) => updateField('overview.stage', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C">Series C</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Industry</label>
                  <input
                    type="text"
                    value={editedData.overview.industry}
                    onChange={(e) => updateField('overview.industry', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">ARR</label>
                  <input
                    type="text"
                    value={editedData.overview.arr}
                    onChange={(e) => updateField('overview.arr', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">Customers</label>
                  <input
                    type="text"
                    value={editedData.overview.customers}
                    onChange={(e) => updateField('overview.customers', e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Mission Statement</label>
            <textarea
              value={editedData.overview.mission}
              onChange={(e) => updateField('overview.mission', e.target.value)}
              rows={4}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
        </div>

        {/* Financials */}
        <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
          <div className="flex items-center gap-4 mb-6">
            <DollarSign size={32} className="text-[#B74B28]" />
            <h2 className="text-3xl font-bold text-[#B74B28]">Financial Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Annual Revenue</label>
              <input
                type="text"
                value={editedData.financials.annualRevenue}
                onChange={(e) => updateField('financials.annualRevenue', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Monthly Burn</label>
              <input
                type="text"
                value={editedData.financials.monthlyBurn}
                onChange={(e) => updateField('financials.monthlyBurn', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Runway</label>
              <input
                type="text"
                value={editedData.financials.runway}
                onChange={(e) => updateField('financials.runway', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Gross Margin</label>
              <input
                type="text"
                value={editedData.financials.grossMargin}
                onChange={(e) => updateField('financials.grossMargin', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <TrendingUp size={32} className="text-[#B74B28]" />
              <h2 className="text-3xl font-bold text-[#B74B28]">Key Metrics</h2>
            </div>
            <Button onClick={addMetric} className="bg-[#fab049] text-[#B74B28]">
              <Plus size={16} className="mr-2" />
              Add Metric
            </Button>
          </div>
          
          <div className="space-y-6">
            {editedData.metrics.map((metric, index) => (
              <div key={index} className="p-6 bg-white rounded-[15px] border-2 border-black">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#B74B28]">Metric #{index + 1}</h3>
                  <button
                    onClick={() => removeMetric(index)}
                    className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <FileText size={32} className="text-[#B74B28]" />
              <h2 className="text-3xl font-bold text-[#B74B28]">Documents</h2>
            </div>
            <Button onClick={addDocument} className="bg-[#fab049] text-[#B74B28]">
              <Plus size={16} className="mr-2" />
              Add Document
            </Button>
          </div>
          
          <div className="space-y-4">
            {editedData.documents.map((doc) => (
              <div key={doc.id} className="p-6 bg-white rounded-[15px] border-2 border-black">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-[#B74B28]" />
                    <h3 className="text-lg font-bold text-[#B74B28]">Document</h3>
                    {doc.pinned && <Pin size={16} className="text-[#B74B28]" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDocument(doc.id, 'pinned', !doc.pinned)}
                      className={`p-2 rounded-lg border-2 border-black ${
                        doc.pinned ? 'bg-[#fab049] text-[#B74B28]' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {doc.pinned ? <Pin size={16} /> : <PinOff size={16} />}
                    </button>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Name</label>
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Type</label>
                    <select
                      value={doc.type}
                      onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOC">Word</option>
                      <option value="XLS">Excel</option>
                      <option value="PPT">PowerPoint</option>
                      <option value="VIDEO">Video</option>
                      <option value="IMAGE">Image</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Size</label>
                    <input
                      type="text"
                      value={doc.size}
                      onChange={(e) => updateDocument(doc.id, 'size', e.target.value)}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Category</label>
                    <select
                      value={doc.category}
                      onChange={(e) => updateDocument(doc.id, 'category', e.target.value)}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    >
                      <option value="company">Company</option>
                      <option value="financial">Financial</option>
                      <option value="legal">Legal</option>
                      <option value="product">Product</option>
                      <option value="market">Market</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Access Level</label>
                    <select
                      value={doc.accessLevel}
                      onChange={(e) => updateDocument(doc.id, 'accessLevel', e.target.value)}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    >
                      <option value="public">Public</option>
                      <option value="restricted">Restricted</option>
                      <option value="confidential">Confidential</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">URL</label>
                  <input
                    type="url"
                    value={doc.url}
                    onChange={(e) => updateDocument(doc.id, 'url', e.target.value)}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funding */}
        <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] p-8">
          <div className="flex items-center gap-4 mb-6">
            <PieChart size={32} className="text-[#B74B28]" />
            <h2 className="text-3xl font-bold text-[#B74B28]">Funding Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Total Raised</label>
              <input
                type="text"
                value={editedData.funding.totalRaised}
                onChange={(e) => updateField('funding.totalRaised', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Current Round</label>
              <input
                type="text"
                value={editedData.funding.currentRound}
                onChange={(e) => updateField('funding.currentRound', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#B74B28] mb-2">Valuation</label>
              <input
                type="text"
                value={editedData.funding.valuation}
                onChange={(e) => updateField('funding.valuation', e.target.value)}
                className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-bold text-[#B74B28] mb-2">Use of Funds</label>
            <textarea
              value={editedData.funding.useOfFunds}
              onChange={(e) => updateField('funding.useOfFunds', e.target.value)}
              rows={4}
              className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};