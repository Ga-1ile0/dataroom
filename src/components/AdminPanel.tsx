import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Edit3,
    X,
    Plus,
    Trash2,
    FileText,
    Settings,
    BarChart3,
    Building,
    DollarSign,
    Users,
    Target,
    Shield,
    PieChart,
    TrendingUp
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

export const AdminPanel: React.FC<AdminPanelProps> = ({
    companyData,
    onUpdateData,
    onSignOut
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    const [tempData, setTempData] = useState<CompanyData>(companyData);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    // Auto-save after 1 second of inactivity
    useEffect(() => {
        if (saveStatus === 'unsaved') {
            if (saveTimeout) clearTimeout(saveTimeout);

            const timeout = setTimeout(() => {
                setSaveStatus('saving');
                onUpdateData(tempData);
                // Simulate network delay
                setTimeout(() => setSaveStatus('saved'), 500);
            }, 1000);

            setSaveTimeout(timeout);

            return () => {
                if (saveTimeout) clearTimeout(saveTimeout);
            };
        }
    }, [tempData, saveStatus, onUpdateData]);

    const tabs = [
        { id: 'overview', name: 'Overview', icon: Building },
        { id: 'financials', name: 'Financials', icon: DollarSign },
        { id: 'market', name: 'Market Analysis', icon: Target },
        { id: 'team', name: 'Team', icon: Users },
        { id: 'product', name: 'Product', icon: TrendingUp },
        { id: 'legal', name: 'Legal', icon: Shield },
        { id: 'metrics', name: 'Metrics', icon: BarChart3 },
        { id: 'funding', name: 'Funding', icon: PieChart },
        { id: 'documents', name: 'Documents', icon: FileText }
    ];

    // Update tempData when companyData changes
    React.useEffect(() => {
        setTempData(companyData);
    }, [companyData]);



    const updateNestedField = useCallback((path: (string | number)[], value: any) => {
        setTempData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newData;
        });
        setSaveStatus('unsaved');
    }, []);

    const addArrayItem = useCallback((path: string[], newItem: any) => {
        setTempData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            if (!Array.isArray(current[path[path.length - 1]])) {
                current[path[path.length - 1]] = [];
            }
            current[path[path.length - 1]].push(newItem);
            return newData;
        });
        setSaveStatus('unsaved');
    }, []);

    const removeArrayItem = useCallback((path: string[], index: number) => {
        setTempData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]].splice(index, 1);
            return newData;
        });
        setSaveStatus('unsaved');
    }, []);

    const updateArrayItem = useCallback((path: string[], index: number, field: string, value: any) => {
        setTempData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]][index][field] = value;
            return newData;
        });
        setSaveStatus('unsaved');
    }, []);

    const EditableField = React.memo(({
        label,
        value,
        path,
        multiline = false,
        type = 'text'
    }: {
        label: string;
        value: string;
        path: (string | number)[];
        multiline?: boolean;
        type?: string;
    }) => {
        const [localValue, setLocalValue] = useState(value);

        // Use a generic ref and then cast it where needed.
        const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

        useEffect(() => {
            // Only update local state if the external value changes and the input is not focused.
            if (document.activeElement !== inputRef.current) {
                setLocalValue(value);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLocalValue(e.target.value);
        };

        const handleBlur = () => {
            // If the value has changed, call the update function.
            if (localValue !== value) {
                const finalValue = type === 'number' ? parseFloat(localValue) || 0 : localValue;
                updateNestedField(path, finalValue);
            }
        };

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {multiline ? (
                    <textarea
                        ref={inputRef}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-2 border-2 border-black rounded-[10px] bg-white"
                    />
                ) : (
                    <input
                        ref={inputRef}
                        type={type}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-2 border-2 border-black rounded-[10px] bg-white"
                    />
                )}
            </div>
        );
    });

    const handleAddDocument = (document: any) => {
        const newDoc = {
            ...document,
            id: Date.now().toString(),
        };

        const updatedData = {
            ...tempData,
            documents: [...tempData.documents, newDoc]
        };

        setTempData(updatedData);
        onUpdateData(updatedData);
    };

    const handleUpdateDocument = (id: string, updates: any) => {
        const updatedData = {
            ...tempData,
            documents: tempData.documents.map(doc =>
                doc.id === id ? { ...doc, ...updates } : doc
            )
        };

        setTempData(updatedData);
        onUpdateData(updatedData);
    };

    const handleDeleteDocument = (id: string) => {
        const updatedData = {
            ...tempData,
            documents: tempData.documents.filter(doc => doc.id !== id)
        };

        setTempData(updatedData);
        onUpdateData(updatedData);
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Company Name"
                        value={tempData.overview.name}
                        path={['overview', 'name']}
                    />
                    <EditableField
                        label="Industry"
                        value={tempData.overview.industry}
                        path={['overview', 'industry']}
                    />
                    <EditableField
                        label="Founded"
                        value={tempData.overview.founded}
                        path={['overview', 'founded']}
                    />
                    <EditableField
                        label="Location"
                        value={tempData.overview.location}
                        path={['overview', 'location']}
                    />
                    <EditableField
                        label="Stage"
                        value={tempData.overview.stage}
                        path={['overview', 'stage']}
                    />
                    <EditableField
                        label="Team Size"
                        value={tempData.overview.teamSize}
                        path={['overview', 'teamSize']}
                    />
                    <EditableField
                        label="ARR"
                        value={tempData.overview.arr}
                        path={['overview', 'arr']}
                    />
                    <EditableField
                        label="Customers"
                        value={tempData.overview.customers}
                        path={['overview', 'customers']}
                    />
                    <EditableField
                        label="Growth Rate"
                        value={tempData.overview.growthRate}
                        path={['overview', 'growthRate']}
                    />
                </div>
                <EditableField
                    label="Description"
                    value={tempData.overview.description}
                    path={['overview', 'description']}
                    multiline
                />
                <EditableField
                    label="Mission Statement"
                    value={tempData.overview.mission}
                    path={['overview', 'mission']}
                    multiline
                />
                <EditableField
                    label="Vision"
                    value={tempData.overview.vision}
                    path={['overview', 'vision']}
                    multiline
                />
                <EditableField
                    label="Values"
                    value={tempData.overview.values}
                    path={['overview', 'values']}
                    multiline
                />
                <EditableField
                    label="Goals"
                    value={tempData.overview.goals}
                    path={['overview', 'goals']}
                    multiline
                />
            </div>
        </div>
    );

    const renderFinancialsTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Key Metrics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Annual Revenue"
                        value={tempData.financials.annualRevenue}
                        path={['financials', 'annualRevenue']}
                    />
                    <EditableField
                        label="Monthly Burn"
                        value={tempData.financials.monthlyBurn}
                        path={['financials', 'monthlyBurn']}
                    />
                    <EditableField
                        label="Runway"
                        value={tempData.financials.runway}
                        path={['financials', 'runway']}
                    />
                    <EditableField
                        label="Gross Margin"
                        value={tempData.financials.grossMargin}
                        path={['financials', 'grossMargin']}
                    />
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Detailed Financials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Revenue ($)"
                        value={tempData.financials.revenue.toString()}
                        path={['financials', 'revenue']}
                        type="number"
                    />
                    <EditableField
                        label="COGS ($)"
                        value={tempData.financials.cogs.toString()}
                        path={['financials', 'cogs']}
                        type="number"
                    />
                    <EditableField
                        label="Operating Expenses ($)"
                        value={tempData.financials.operatingExpenses.toString()}
                        path={['financials', 'operatingExpenses']}
                        type="number"
                    />
                    <EditableField
                        label="Cash Balance ($)"
                        value={tempData.financials.cashBalance.toString()}
                        path={['financials', 'cashBalance']}
                        type="number"
                    />
                    <EditableField
                        label="Operating Cash Flow ($)"
                        value={tempData.financials.operatingCashFlow.toString()}
                        path={['financials', 'operatingCashFlow']}
                        type="number"
                    />
                    <EditableField
                        label="Investing Cash Flow ($)"
                        value={tempData.financials.investingCashFlow.toString()}
                        path={['financials', 'investingCashFlow']}
                        type="number"
                    />
                    <EditableField
                        label="Financing Cash Flow ($)"
                        value={tempData.financials.financingCashFlow.toString()}
                        path={['financials', 'financingCashFlow']}
                        type="number"
                    />
                    <EditableField
                        label="Net Cash Flow ($)"
                        value={tempData.financials.netCashFlow.toString()}
                        path={['financials', 'netCashFlow']}
                        type="number"
                    />
                </div>
            </div>
        </div>
    );

    const renderMarketTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Market Size</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <EditableField
                        label="TAM (Total Addressable Market)"
                        value={tempData.market.tam}
                        path={['market', 'tam']}
                    />
                    <EditableField
                        label="SAM (Serviceable Addressable Market)"
                        value={tempData.market.sam}
                        path={['market', 'sam']}
                    />
                    <EditableField
                        label="SOM (Serviceable Obtainable Market)"
                        value={tempData.market.som}
                        path={['market', 'som']}
                    />
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Competitors</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['market', 'competitors'], { name: '', type: 'Direct', description: '' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Competitor
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.market.competitors.map((competitor, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Competitor {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['market', 'competitors'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={competitor.name}
                                        onChange={(e) => updateArrayItem(['market', 'competitors'], index, 'name', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Type</label>
                                    <select
                                        value={competitor.type}
                                        onChange={(e) => updateArrayItem(['market', 'competitors'], index, 'type', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="Direct">Direct</option>
                                        <option value="Indirect">Indirect</option>
                                        <option value="Substitute">Substitute</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-bold text-[#B74B28] mb-1">Description</label>
                                <textarea
                                    value={competitor.description}
                                    onChange={(e) => updateArrayItem(['market', 'competitors'], index, 'description', e.target.value)}
                                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Market Trends</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['market', 'trends'], '')}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Trend
                    </Button>
                </div>

                <div className="space-y-3">
                    {tempData.market.trends.map((trend, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={trend}
                                onChange={(e) => {
                                    const newTrends = [...tempData.market.trends];
                                    newTrends[index] = e.target.value;
                                    updateNestedField(['market', 'trends'], newTrends);
                                }}
                                className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                placeholder="Enter market trend"
                            />
                            <button
                                onClick={() => removeArrayItem(['market', 'trends'], index)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTeamTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Leadership Team</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['team', 'leadership'], { name: '', role: '', background: '' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Leader
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.team.leadership.map((member, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Leader {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['team', 'leadership'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => updateArrayItem(['team', 'leadership'], index, 'name', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={(e) => updateArrayItem(['team', 'leadership'], index, 'role', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-bold text-[#B74B28] mb-1">Background</label>
                                <textarea
                                    value={member.background}
                                    onChange={(e) => updateArrayItem(['team', 'leadership'], index, 'background', e.target.value)}
                                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Advisory Board</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['team', 'advisors'], { name: '', background: '' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Advisor
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.team.advisors.map((advisor, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Advisor {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['team', 'advisors'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={advisor.name}
                                        onChange={(e) => updateArrayItem(['team', 'advisors'], index, 'name', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Background</label>
                                    <textarea
                                        value={advisor.background}
                                        onChange={(e) => updateArrayItem(['team', 'advisors'], index, 'background', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Team Statistics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Total Employees"
                        value={tempData.team.totalEmployees.toString()}
                        path={['team', 'totalEmployees']}
                        type="number"
                    />
                    <EditableField
                        label="Engineering"
                        value={tempData.team.engineering.toString()}
                        path={['team', 'engineering']}
                        type="number"
                    />
                    <EditableField
                        label="Sales & Marketing"
                        value={tempData.team.salesMarketing.toString()}
                        path={['team', 'salesMarketing']}
                        type="number"
                    />
                    <EditableField
                        label="Operations"
                        value={tempData.team.operations.toString()}
                        path={['team', 'operations']}
                        type="number"
                    />
                </div>
            </div>
        </div>
    );

    const renderProductTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Core Features</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['product', 'features'], '')}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Feature
                    </Button>
                </div>

                <div className="space-y-3">
                    {tempData.product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                    const newFeatures = [...tempData.product.features];
                                    newFeatures[index] = e.target.value;
                                    updateNestedField(['product', 'features'], newFeatures);
                                }}
                                className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                placeholder="Enter feature"
                            />
                            <button
                                onClick={() => removeArrayItem(['product', 'features'], index)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Technology Stack</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['product', 'techStack'], '')}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Technology
                    </Button>
                </div>

                <div className="space-y-3">
                    {tempData.product.techStack.map((tech, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={tech}
                                onChange={(e) => {
                                    const newTechStack = [...tempData.product.techStack];
                                    newTechStack[index] = e.target.value;
                                    updateNestedField(['product', 'techStack'], newTechStack);
                                }}
                                className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                placeholder="Enter technology"
                            />
                            <button
                                onClick={() => removeArrayItem(['product', 'techStack'], index)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Product Roadmap</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['product', 'roadmap'], { quarter: '', features: [], status: 'Planned' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Roadmap Item
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.product.roadmap.map((roadmap, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Roadmap {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['product', 'roadmap'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Quarter</label>
                                    <input
                                        type="text"
                                        value={roadmap.quarter}
                                        onChange={(e) => updateArrayItem(['product', 'roadmap'], index, 'quarter', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="Q1 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Status</label>
                                    <select
                                        value={roadmap.status}
                                        onChange={(e) => updateArrayItem(['product', 'roadmap'], index, 'status', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#B74B28] mb-1">Features (comma-separated)</label>
                                <textarea
                                    value={roadmap.features.join(', ')}
                                    onChange={(e) => updateArrayItem(['product', 'roadmap'], index, 'features', e.target.value.split(', ').filter(f => f.trim()))}
                                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                                    rows={2}
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderLegalTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Corporate Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Entity Type"
                        value={tempData.legal.entityType}
                        path={['legal', 'entityType']}
                    />
                    <EditableField
                        label="Incorporation Date"
                        value={tempData.legal.incorporationDate}
                        path={['legal', 'incorporationDate']}
                    />
                    <EditableField
                        label="EIN"
                        value={tempData.legal.ein}
                        path={['legal', 'ein']}
                    />
                    <EditableField
                        label="Address"
                        value={tempData.legal.address}
                        path={['legal', 'address']}
                        multiline
                    />
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Intellectual Property</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['legal', 'intellectualProperty'], { type: 'Patent', name: '', status: 'Planned' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add IP
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.legal.intellectualProperty.map((ip, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">IP {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['legal', 'intellectualProperty'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Type</label>
                                    <select
                                        value={ip.type}
                                        onChange={(e) => updateArrayItem(['legal', 'intellectualProperty'], index, 'type', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="Patent">Patent</option>
                                        <option value="Trademark">Trademark</option>
                                        <option value="Copyright">Copyright</option>
                                        <option value="Trade Secret">Trade Secret</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={ip.name}
                                        onChange={(e) => updateArrayItem(['legal', 'intellectualProperty'], index, 'name', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Status</label>
                                    <select
                                        value={ip.status}
                                        onChange={(e) => updateArrayItem(['legal', 'intellectualProperty'], index, 'status', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Filed">Filed</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Compliance & Certifications</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['legal', 'compliance'], '')}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Compliance
                    </Button>
                </div>

                <div className="space-y-3">
                    {tempData.legal.compliance.map((compliance, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={compliance}
                                onChange={(e) => {
                                    const newCompliance = [...tempData.legal.compliance];
                                    newCompliance[index] = e.target.value;
                                    updateNestedField(['legal', 'compliance'], newCompliance);
                                }}
                                className="flex-1 p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                placeholder="Enter compliance standard"
                            />
                            <button
                                onClick={() => removeArrayItem(['legal', 'compliance'], index)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMetricsTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Key Performance Indicators</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['metrics'], {
                            label: '',
                            value: '',
                            change: '',
                            trend: 'up',
                            category: 'engagement',
                            description: '',
                            chartData: [],
                            period: 'Last 5 months'
                        })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Metric
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.metrics.map((metric, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Metric {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['metrics'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={metric.label}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'label', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="e.g., Monthly Active Users"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Value</label>
                                    <input
                                        type="text"
                                        value={metric.value}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'value', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="e.g., 1,250"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Change</label>
                                    <input
                                        type="text"
                                        value={metric.change}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'change', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="e.g., +15%"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Trend</label>
                                    <select
                                        value={metric.trend}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'trend', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="up">Up</option>
                                        <option value="down">Down</option>
                                        <option value="stable">Stable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Category</label>
                                    <select
                                        value={metric.category}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'category', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="revenue">Revenue</option>
                                        <option value="growth">Growth</option>
                                        <option value="engagement">Engagement</option>
                                        <option value="financial">Financial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Period</label>
                                    <input
                                        type="text"
                                        value={metric.period || ''}
                                        onChange={(e) => updateArrayItem(['metrics'], index, 'period', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="e.g., Last 5 months"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-bold text-[#B74B28] mb-1">Description</label>
                                <textarea
                                    value={metric.description || ''}
                                    onChange={(e) => updateArrayItem(['metrics'], index, 'description', e.target.value)}
                                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049] resize-none"
                                    rows={2}
                                    placeholder="Brief description of this metric"
                                />
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-bold text-[#B74B28] mb-1">Chart Data (comma-separated numbers)</label>
                                <input
                                    type="text"
                                    value={metric.chartData?.join(', ') || ''}
                                    onChange={(e) => {
                                        const values = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                                        updateArrayItem(['metrics'], index, 'chartData', values);
                                    }}
                                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    placeholder="e.g., 850, 920, 1050, 1180, 1247"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Live Preview</h3>
                <p className="text-[#73430C] mb-6">This is how the metrics will appear to investors</p>
                <MetricsChart metrics={tempData.metrics} />
            </div>
        </div>
    );

    const renderFundingTab = () => (
        <div className="space-y-6">
            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <h3 className="text-xl font-bold text-[#B74B28] mb-4">Funding Overview</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <EditableField
                        label="Total Raised"
                        value={tempData.funding.totalRaised}
                        path={['funding', 'totalRaised']}
                    />
                    <EditableField
                        label="Current Round"
                        value={tempData.funding.currentRound}
                        path={['funding', 'currentRound']}
                    />
                    <EditableField
                        label="Target Amount"
                        value={tempData.funding.targetAmount}
                        path={['funding', 'targetAmount']}
                    />
                    <EditableField
                        label="Valuation"
                        value={tempData.funding.valuation}
                        path={['funding', 'valuation']}
                    />
                </div>
                <EditableField
                    label="Use of Funds"
                    value={tempData.funding.useOfFunds}
                    path={['funding', 'useOfFunds']}
                    multiline
                />
            </div>

            <div className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#B74B28]">Investor Portfolio</h3>
                    <Button
                        size="sm"
                        onClick={() => addArrayItem(['funding', 'investors'], { name: '', type: 'Angel', amount: '' })}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Investor
                    </Button>
                </div>

                <div className="space-y-4">
                    {tempData.funding.investors.map((investor, index) => (
                        <div key={index} className="p-4 bg-white rounded-[10px] border-2 border-black">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-[#B74B28]">Investor {index + 1}</h4>
                                <button
                                    onClick={() => removeArrayItem(['funding', 'investors'], index)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={investor.name}
                                        onChange={(e) => updateArrayItem(['funding', 'investors'], index, 'name', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Type</label>
                                    <select
                                        value={investor.type}
                                        onChange={(e) => updateArrayItem(['funding', 'investors'], index, 'type', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                    >
                                        <option value="Angel">Angel</option>
                                        <option value="VC">VC</option>
                                        <option value="Strategic">Strategic</option>
                                        <option value="Institutional">Institutional</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#B74B28] mb-1">Amount</label>
                                    <input
                                        type="text"
                                        value={investor.amount}
                                        onChange={(e) => updateArrayItem(['funding', 'investors'], index, 'amount', e.target.value)}
                                        className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                                        placeholder="$100K"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDocumentsTab = () => (
        <div className="space-y-6">
            <DocumentManager
                documents={tempData.documents}
                onAddDocument={handleAddDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
                isAdmin={true}
            />
        </div>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverviewTab();
            case 'financials':
                return renderFinancialsTab();
            case 'market':
                return renderMarketTab();
            case 'team':
                return renderTeamTab();
            case 'product':
                return renderProductTab();
            case 'legal':
                return renderLegalTab();
            case 'metrics':
                return renderMetricsTab();
            case 'funding':
                return renderFundingTab();
            case 'documents':
                return renderDocumentsTab();
            default:
                return renderOverviewTab();
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
                        <h1 className="text-3xl md:text-4xl font-bold text-[#B74B28] transform rotate-1">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-[#B74B28] opacity-75">DataVault Management</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm bg-white/50 px-3 py-1.5 rounded-full border border-black/10">
                        <div className={`w-2.5 h-2.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' :
                                saveStatus === 'saving' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                        <span className="text-gray-700">
                            {saveStatus === 'saved' ? 'All changes saved' :
                                saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
                        </span>
                    </div>
                    <Button onClick={onSignOut} variant="outline">
                        Sign Out
                    </Button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#FFF1D6] border-r-4 border-black min-h-screen p-6">
                    <nav className="space-y-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-[10px] border-2 border-black transition-all transform hover:scale-105 ${activeTab === tab.id
                                    ? "bg-[#FAB049] text-[#B74B28] shadow-[3px_3px_0px_#000000] rotate-1"
                                    : "bg-white text-[#73430C] hover:bg-[#FAB049] -rotate-1"
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-medium text-sm">{tab.name}</span>
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
                                    {tabs.find((t) => t.id === activeTab)?.icon && (
                                        <div className="w-10 h-10 bg-[#FAB049] rounded-full border-3 border-black flex items-center justify-center">
                                            {(() => {
                                                const IconComponent = tabs.find((t) => t.id === activeTab)?.icon;
                                                return IconComponent ? <IconComponent size={20} className="text-[#B74B28]" /> : null;
                                            })()}
                                        </div>
                                    )}
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#B74B28]">
                                        {tabs.find((t) => t.id === activeTab)?.name}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Section Content */}
                        {renderActiveTab()}
                    </div>
                </main>
            </div>
        </div>
    );
};
