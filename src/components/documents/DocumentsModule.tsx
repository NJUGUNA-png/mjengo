import React, { useState } from 'react';
import { useSiteFlow } from '../../context/SiteFlowContext';
import { 
  FolderArchive, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Lock, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { ProjectDocument, DocumentCategory } from '../../types';

export const DocumentsModule: React.FC = () => {
  const { documents, addDocument, projects, selectedProjectId, currentUser } = useSiteFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  // New Document State
  const [newDoc, setNewDoc] = useState({
    projectId: selectedProjectId === 'ALL' ? projects[0]?.id || 'PRJ-01' : selectedProjectId,
    title: '',
    category: 'Architectural Drawings' as DocumentCategory,
    fileName: '',
    version: 'v1.0 - Approved For Construction',
    fileSize: '12.4 MB',
    accessLevel: 'All Project Team' as ProjectDocument['accessLevel']
  });

  const categoriesList: DocumentCategory[] = [
    'Architectural Drawings',
    'Structural Drawings',
    'MEP Engineering',
    'Bills of Quantities (BOQ)',
    'Statutory Permits (NCA/NEMA/County)',
    'Contracts & Guarantees',
    'Inspection Reports & QA',
    'Site Photos'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesProj = selectedProjectId === 'ALL' || doc.projectId === selectedProjectId;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesProj && matchesSearch && matchesCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.fileName) return;

    addDocument({
      ...newDoc,
      uploadedDate: new Date().toISOString().substring(0, 10),
      uploadedBy: `${currentUser.name} (${currentUser.role})`,
      status: 'Current'
    });

    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Centralized Engineering Document Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Architectural & structural drawings, BOQs, statutory NCA permits, and version-controlled contracts.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document title, filename, or architect/engineer..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                  {doc.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {doc.title}
              </h4>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                  {doc.fileName}
                </span>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">{doc.fileSize}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Version: <strong className="text-slate-700 dark:text-slate-300 font-mono">{doc.version}</strong></span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3" />
                  {doc.accessLevel}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">{doc.uploadedDate}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 rounded transition-colors"
                    title="View Document Metadata"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading official CAD/PDF document: ${doc.fileName}`);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Construction Drawing Inspector
              </h3>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{previewDoc.title}</div>
                <div className="text-slate-500">{previewDoc.fileName} · {previewDoc.fileSize}</div>
                <div className="text-amber-500 font-mono font-semibold">{previewDoc.version}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <strong className="text-slate-900 dark:text-white">{previewDoc.category}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Authorized Access</span>
                  <strong className="text-slate-900 dark:text-white">{previewDoc.accessLevel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Uploaded Date</span>
                  <strong className="text-slate-900 dark:text-white">{previewDoc.uploadedDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Signing Engineer</span>
                  <strong className="text-slate-900 dark:text-white">{previewDoc.uploadedBy}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>NCA & County Authority Regulatory Stamp Verified</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Engineering Document / Drawing
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structural Rebar Schedule Rev C"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CAD / PDF File Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="KLM-STR-REV-03.pdf"
                    value={newDoc.fileName}
                    onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Version Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.version}
                    onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Access Authorization Level
                </label>
                <select
                  value={newDoc.accessLevel}
                  onChange={(e) => setNewDoc({ ...newDoc, accessLevel: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="All Project Team">All Project Team</option>
                  <option value="Management Only">Management Only</option>
                  <option value="Consultants & Engineers">Consultants & Engineers</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-colors"
                >
                  Upload & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
