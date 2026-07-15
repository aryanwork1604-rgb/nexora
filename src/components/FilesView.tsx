import React, { useState, useRef } from "react";
import { 
  Plus, Upload, FileText, Image, FileArchive, Trash2, Download, Search, CheckCircle2, 
  HelpCircle, Eye, CornerDownLeft, AlertCircle
} from "lucide-react";
import { WorkspaceFile } from "../types";

interface FilesViewProps {
  files: WorkspaceFile[];
  onUploadFile: (name: string, size: string, type: string) => void;
  onDeleteFile: (fileId: string) => void;
  currentUserName: string;
}

export default function FilesView({
  files,
  onUploadFile,
  onDeleteFile,
  currentUserName
}: FilesViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterQuery, setFilterQuery] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Human-readable size converter
    let sizeStr = "1.2 MB";
    if (file.size > 1024 * 1024) {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
    }

    onUploadFile(file.name, sizeStr, file.type);
  };

  const filteredFiles = files.filter((f) => 
    f.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    f.uploadedBy.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <Image className="w-5 h-5 text-emerald-400" />;
    if (type.includes("pdf") || type.includes("doc")) return <FileText className="w-5 h-5 text-indigo-400" />;
    if (type.includes("zip") || type.includes("rar")) return <FileArchive className="w-5 h-5 text-amber-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">File Depository</h1>
          <p className="text-xs text-slate-400">Secure, isolated file vault. Complete with mock drag-and-drop triggers, size indicators, and asset previews.</p>
        </div>
        <button
          onClick={triggerInput}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95 duration-150"
        >
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        onChange={handleFileSelect}
      />

      {/* Drag Box */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer backdrop-blur-sm ${
          dragActive 
            ? "border-indigo-500 bg-indigo-500/5 shadow-inner" 
            : "border-slate-800 hover:border-slate-700 bg-slate-900/10"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
          <Upload className={`w-5 h-5 ${dragActive ? "text-indigo-400 animate-bounce" : ""}`} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-200">Drag & Drop files here, or <span className="text-indigo-400 hover:underline">browse files</span></h3>
          <p className="text-[11px] text-slate-500 mt-1">Supports PDF, PNG, JPG, DOCX, and ZIP up to 100MB per file.</p>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="flex items-center gap-3 bg-slate-900/20 border border-slate-900 rounded-xl px-4 py-3 text-xs justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-slate-200 text-xs w-full"
            placeholder="Search resources by name or owner..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
        <span className="text-slate-500 font-mono text-[11px] font-medium hidden sm:inline">Active storage: {files.length} items logged</span>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-16 text-center flex flex-col items-center gap-3">
          <FileText className="w-12 h-12 text-slate-700 animate-pulse" />
          <h3 className="font-bold text-slate-300 text-sm">No Files Found</h3>
          <p className="text-xs text-slate-500 max-w-sm">Utilize the drag-and-drop uploader above to populate your team's document depository.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div 
              key={file.id}
              className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition-all flex flex-col justify-between group relative backdrop-blur-sm"
            >
              {/* Image Preview Thumbnail */}
              <div className="h-28 w-full bg-slate-950 border-b border-slate-900 overflow-hidden relative">
                <img src={file.url} alt="thumbnail" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800/60 flex items-center justify-center backdrop-blur-sm">
                  {getFileIcon(file.type)}
                </div>
              </div>

              {/* Specs */}
              <div className="p-4 flex flex-col gap-2.5">
                <div>
                  <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-indigo-400 transition-colors" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-mono">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span className="truncate">By {file.uploadedBy.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Footer and interactive actions */}
                <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5 text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                    <span>Ver. {file.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Simulated Download button */}
                    <button
                      onClick={() => alert(`Triggering secure multi-tenant download for: "${file.name}"`)}
                      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                      title="Download resource"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteFile(file.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Delete resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
