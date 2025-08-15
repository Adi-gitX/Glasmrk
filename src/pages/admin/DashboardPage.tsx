import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { FileText, Trash2, Eye, Copy, Plus } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { FileUpload } from '../../components/markdown/FileUpload';
import { useAuth } from '../../hooks/useAuth';
import { getFiles, deleteFile, saveFile } from '../../utils/storage';
import { MarkdownFile } from '../../types';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    setFiles(getFiles());
  };

  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const content = await selectedFile.text();
    saveFile({
      title: selectedFile.name.replace('.md', ''),
      content
    });

    setSelectedFile(null);
    setShowUpload(false);
    loadFiles();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteFile(id);
      loadFiles();
    }
  };

  const copyShareLink = async (encryptedId: string) => {
    const url = `${window.location.origin}/view/${encryptedId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(encryptedId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const viewFile = (encryptedId: string) => {
    window.open(`/view/${encryptedId}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage your markdown files</p>
            </div>
            <GlassButton
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add File</span>
            </GlassButton>
          </div>
        </motion.div>

        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload New File</h2>
              <div className="space-y-4">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile || undefined}
                  onClear={() => setSelectedFile(null)}
                />
                {selectedFile && (
                  <div className="flex space-x-3">
                    <GlassButton onClick={handleUpload}>
                      Upload File
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      onClick={() => setShowUpload(false)}
                    >
                      Cancel
                    </GlassButton>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid gap-6">
          {files.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Files Yet</h3>
              <p className="text-gray-400">
                Upload your first markdown file to get started
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {file.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Created {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <GlassButton
                          variant="secondary"
                          onClick={() => viewFile(file.encryptedId)}
                          className="!px-3 !py-2"
                        >
                          <Eye className="h-4 w-4" />
                        </GlassButton>
                        <GlassButton
                          variant="secondary"
                          onClick={() => copyShareLink(file.encryptedId)}
                          className="!px-3 !py-2"
                        >
                          {copiedId === file.encryptedId ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </GlassButton>
                        <GlassButton
                          variant="danger"
                          onClick={() => handleDelete(file.id)}
                          className="!px-3 !py-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};