import React, { useState } from 'react';
import { Plus, Upload, Link, Trash2, Edit3, Save, X, FileText, ExternalLink, Pin, PinOff } from 'lucide-react';
import { Document } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface DocumentManagerProps {
  documents: Document[];
  onAddDocument: (document: Omit<Document, 'id'>) => void;
  onUpdateDocument: (id: string, document: Partial<Document>) => void;
  onDeleteDocument: (id: string) => void;
  isAdmin: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  isAdmin
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Document>>({});
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'PDF',
    size: '',
    url: '',
    category: 'company',
    accessLevel: 'public' as 'public' | 'restricted' | 'confidential',
    pinned: false
  });

  const categories = [
    { id: 'company', name: 'Company Overview' },
    { id: 'financial', name: 'Financial' },
    { id: 'legal', name: 'Legal' },
    { id: 'product', name: 'Product' },
    { id: 'market', name: 'Market Research' }
  ];

  const accessLevels = [
    { id: 'public', name: 'Public', color: 'bg-green-100 text-green-800' },
    { id: 'restricted', name: 'Restricted', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'confidential', name: 'Confidential', color: 'bg-red-100 text-red-800' }
  ];

  const handleAddDocument = () => {
    if (!newDoc.name || !newDoc.url) return;

    const document: Omit<Document, 'id'> = {
      ...newDoc,
      lastModified: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    onAddDocument(document);
    setNewDoc({
      name: '',
      type: 'PDF',
      size: '',
      url: '',
      category: 'company',
      accessLevel: 'public',
      pinned: false
    });
    setShowAddModal(false);
  };

  const handleStartEdit = (doc: Document) => {
    setEditingDoc(doc.id);
    setEditForm({
      name: doc.name,
      type: doc.type,
      size: doc.size,
      url: doc.url,
      category: doc.category,
      accessLevel: doc.accessLevel,
      pinned: doc.pinned || false
    });
  };

  const handleSaveEdit = () => {
    if (!editingDoc) return;
    
    onUpdateDocument(editingDoc, {
      ...editForm,
      lastModified: new Date().toISOString().split('T')[0]
    });
    
    setEditingDoc(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingDoc(null);
    setEditForm({});
  };

  const handleTogglePin = (doc: Document) => {
    onUpdateDocument(doc.id, { pinned: !doc.pinned });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to a storage service
    // For now, we'll create a mock URL
    const mockUrl = `https://storage.example.com/${file.name}`;
    
    setNewDoc(prev => ({
      ...prev,
      name: file.name,
      type: file.type.split('/')[1].toUpperCase() || 'FILE',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      url: mockUrl
    }));
  };

  const getAccessLevelColor = (level: string) => {
    const accessLevel = accessLevels.find(al => al.id === level);
    return accessLevel?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#B74B28]">Document Library</h3>
        {isAdmin && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#fab049] text-[#B74B28] border-2 border-black"
          >
            <Plus size={16} className="mr-2" />
            Add Document
          </Button>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#FFF1D6] p-6 rounded-[15px] border-4 border-black shadow-[5px_5px_0px_#000000]"
          >
            {editingDoc === doc.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-[#B74B28]">Edit Document</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 bg-green-500 text-white rounded-lg border-2 border-black"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-red-500 text-white rounded-lg border-2 border-black"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Type</label>
                    <select
                      value={editForm.type || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
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
                      value={editForm.size || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Category</label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">Access Level</label>
                    <select
                      value={editForm.accessLevel || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                      className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                    >
                      {accessLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`pinned-${doc.id}`}
                      checked={editForm.pinned || false}
                      onChange={(e) => setEditForm(prev => ({ ...prev, pinned: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`pinned-${doc.id}`} className="text-sm font-bold text-[#B74B28]">
                      Pin to Quick Access
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">URL</label>
                  <input
                    type="url"
                    value={editForm.url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full p-2 border-2 border-black rounded-[8px] focus:outline-none focus:border-[#fab049]"
                  />
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#fab049] rounded-lg border-2 border-black flex items-center justify-center">
                    <FileText size={20} className="text-[#B74B28]" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-[#B74B28]">{doc.name}</h4>
                      {doc.pinned && (
                        <Pin size={16} className="text-[#B74B28]" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{doc.type} • {doc.size}</span>
                      <span>Modified: {doc.lastModified}</span>
                      <Badge className={`text-xs ${getAccessLevelColor(doc.accessLevel)}`}>
                        {doc.accessLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#7583FA] text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleTogglePin(doc)}
                        className={`p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all ${
                          doc.pinned ? 'bg-[#fab049] text-[#B74B28]' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {doc.pinned ? <Pin size={16} /> : <PinOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleStartEdit(doc)}
                        className="p-2 bg-[#fab049] text-[#B74B28] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-2 bg-red-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFF1D6] rounded-[20px] border-4 border-black shadow-[8px_8px_0px_#000000] w-full max-w-md">
            <div className="p-6 border-b-4 border-black">
              <h3 className="text-2xl font-bold text-[#B74B28]">Add New Document</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-[#B74B28] mb-2">
                  Upload File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#B74B28] rounded-[10px] cursor-pointer hover:bg-[#FAB049] transition-colors"
                  >
                    <Upload size={20} className="text-[#B74B28]" />
                    <span className="text-[#B74B28] font-medium">Choose File</span>
                  </label>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#B74B28]"></div>
                <span className="text-[#B74B28] font-bold">OR</span>
                <div className="flex-1 h-px bg-[#B74B28]"></div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                    placeholder="Enter document name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#B74B28] mb-2">
                    Document URL
                  </label>
                  <div className="relative">
                    <Link size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="url"
                      value={newDoc.url}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full pl-10 pr-4 p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                      placeholder="https://example.com/document.pdf"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">
                      Type
                    </label>
                    <select
                      value={newDoc.type}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
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
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      value={newDoc.size}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                      placeholder="2.4 MB"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">
                      Category
                    </label>
                    <select
                      value={newDoc.category}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#B74B28] mb-2">
                      Access Level
                    </label>
                    <select
                      value={newDoc.accessLevel}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                      className="w-full p-3 border-2 border-black rounded-[10px] focus:outline-none focus:border-[#fab049]"
                    >
                      {accessLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned-new"
                    checked={newDoc.pinned}
                    onChange={(e) => setNewDoc(prev => ({ ...prev, pinned: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="pinned-new" className="text-sm font-bold text-[#B74B28]">
                    Pin to Quick Access
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t-4 border-black flex gap-4">
              <Button
                onClick={handleAddDocument}
                disabled={!newDoc.name || !newDoc.url}
                className="flex-1 bg-[#fab049] text-[#B74B28] border-2 border-black"
              >
                <Save size={16} className="mr-2" />
                Add Document
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="flex-1"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};