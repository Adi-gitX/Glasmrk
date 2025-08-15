import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';

interface FileUploadProps {
  onFileSelect: (file: File, content: string) => void;
  selectedFile?: File;
  onClear?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  selectedFile,
  onClear 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/markdown' || file.name.endsWith('.md')) {
      const content = await file.text();
      onFileSelect(file, content);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md'],
      'text/plain': ['.md']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  if (selectedFile) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold text-lg">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {onClear && (
            <GlassButton
              variant="secondary"
              onClick={onClear}
              className="!px-3 !py-2"
            >
              <X className="h-4 w-4" />
            </GlassButton>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-12">
      <motion.div
        {...getRootProps()}
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? '#60a5fa' : 'rgba(255,255,255,0.1)'
        }}
        className="border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer
                   transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/5"
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? -8 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-4"
        >
          <Upload className="h-16 w-16 text-blue-400 mx-auto" />
          <div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Drop your markdown file here
            </h3>
            <p className="text-gray-400 text-lg">
              or click to browse your files
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Supports .md files up to 10MB
            </p>
          </div>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
};