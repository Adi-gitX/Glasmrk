import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';
import { FileUpload } from '../components/markdown/FileUpload';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { Modal } from '../components/ui/Modal';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { saveFile } from '../utils/storage';

export const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const previewBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile(file);
    setFileContent(content);
    setShareUrl('');
  // open preview immediately after the file is selected (first step)
  setIsPreviewOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileContent) return;

    setIsUploading(true);
    
    // Simulate upload delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const savedFile = await saveFile({
        title: selectedFile.name.replace('.md', ''),
        content: fileContent
      });

      if (savedFile && savedFile.encryptedId) {
        const url = `${window.location.origin}/view/${savedFile.encryptedId}`;
        setShareUrl(url);
        console.log('[HomePage] Upload complete, shareUrl=', url);
      } else {
        console.error('[HomePage] saveFile did not return an encryptedId', savedFile);
        setShareUrl('');
      }
    } catch (err) {
      console.error('[HomePage] failed to save file', err);
      setShareUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileContent('');
    setShareUrl('');
    setIsPreviewOpen(false);
  };

  const spacerRef = React.useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  // Observe the spacer: when it becomes visible, render the preview card
  React.useEffect(() => {
    const el = spacerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowPreview(true);
            observer.disconnect();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Share Markdown
            <span className="text-blue-400"> Beautifully</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your markdown files and get shareable links with GitHub-style rendering.
            No sign-up required for viewers.
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="mx-auto max-w-2xl space-y-6 flex flex-col items-center justify-center pt-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile || undefined}
              onClear={selectedFile ? clearFile : undefined}
            />

            {selectedFile && !shareUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassButton
                  ref={previewBtnRef}
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full !py-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>{isUploading ? 'Creating Share Link...' : 'Create Share Link'}</span>
                  </div>
                </GlassButton>
              </motion.div>
            )}

            {shareUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Share Link Created!
                  </h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-2 bg-black/50 border border-gray-600
                               rounded-lg text-white text-sm"
                    />
                    <GlassButton onClick={copyToClipboard} className="!px-3 !py-2">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </GlassButton>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Anyone with this link can view your markdown file
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* spacer that creates the big gap; when it scrolls into view we show the preview */}
          <div ref={spacerRef} className="h-[12vh] md:h-[18vh] lg:h-[24vh]" />

          <div className="mx-auto max-w-4xl">
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <GlassCard className="p-12 text-center">
                  <div className="text-gray-400">
                    <h3 className="text-lg font-semibold mb-2">Preview</h3>
                    <p>Upload a markdown file to see the preview (opens as a popup)</p>
                    {fileContent && (
                      <div className="mt-6 mb-8">
                        <GlassButton onClick={() => setIsPreviewOpen(true)}>
                          Open Preview
                        </GlassButton>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
  <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <div className="max-h-[80vh] overflow-auto">
          <MarkdownRenderer
            content={fileContent}
            title={selectedFile?.name.replace('.md', '')}
          />
        </div>
      </Modal>
  {/* bottom spacer to add breathing room so content isn't hidden behind fixed footer */}
  <div className="h-12 md:h-20" aria-hidden="true" />
      {/* Liquid glass footer */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-auto">
        <div className="px-4 py-2 liquid-footer rounded-full flex items-center justify-center text-sm">
          Made by Adi-GitX
        </div>
      </div>
    </div>
  );
};