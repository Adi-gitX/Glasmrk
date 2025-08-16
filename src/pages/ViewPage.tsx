import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle } from 'lucide-react';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { GlassCard } from '../components/ui/GlassCard';
import { getFileByEncryptedId } from '../utils/storage';
import { MarkdownFile } from '../types';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<MarkdownFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!id) {
        if (!mounted) return;
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const foundFile = await getFileByEncryptedId(id);
        if (!mounted) return;
        if (foundFile) setFile(foundFile);
        else setNotFound(true);
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black 
                      pt-24 pb-12 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FileText className="h-8 w-8 text-blue-400" />
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">File Not Found</h1>
            <p className="text-gray-400">
              The markdown file you're looking for doesn't exist or has been removed.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {file && <MarkdownRenderer content={file.content} title={file.title} />}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Created {new Date(file?.createdAt || '').toLocaleDateString()}
          </p>
        </motion.div>
      </div>
      {/* unobtrusive credit pill */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow text-xs text-white/80">
          Made by Adi-GitX
        </div>
      </div>
    </div>
  );
};

// Add unobtrusive credit on shared pages
export const ViewPageCredit: React.FC = () => null;