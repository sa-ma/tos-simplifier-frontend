'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Sparkles, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SimplifiedSection {
  [key: string]: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [simplificationLevel, setSimplificationLevel] = useState<string>('8th');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SimplifiedSection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setResults(null);
    // Reset the file input using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please select a valid PDF file');
        setFile(null);
      }
    }
  };

  const handleSimplify = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('level', simplificationLevel);

      const response = await fetch('/api/simplify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to simplify document');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to simplify document. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col'>
      <div className='container mx-auto px-4 py-8 flex-1'>
        <motion.div initial='hidden' animate='visible' variants={containerVariants} className='max-w-4xl mx-auto'>
          {/* Header */}
          <motion.div variants={itemVariants} className='text-center mb-12'>
            <motion.h1
              className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'
              whileHover={{ scale: 1.02 }}
            >
              TOS Simplifier
            </motion.h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Upload your Terms of Service PDF and get a simplified, easy-to-understand version
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div variants={itemVariants} className='mb-8'>
            <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <FileText className='h-6 w-6 text-blue-600' />
                  Upload Your Document
                </CardTitle>
                <CardDescription>Select a PDF file containing your Terms of Service</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* File Upload */}
                <div className='space-y-2'>
                  <Label htmlFor='file-upload' className='text-base font-medium'>
                    Choose PDF File
                  </Label>
                  <div className='relative'>
                    <input
                      id='file-upload'
                      ref={fileInputRef}
                      type='file'
                      accept='.pdf'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                    <label
                      htmlFor='file-upload'
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        isDragOver
                          ? 'border-blue-400 bg-blue-50 scale-105'
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <Upload className='h-8 w-8 text-gray-400 mb-2' />
                      <span className='text-sm text-gray-500'>
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className='text-xs text-gray-400 mt-1'>PDF files only</span>
                    </label>
                  </div>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='flex items-center justify-between text-sm text-green-600 bg-green-50 p-3 rounded-md'
                    >
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4' />
                        <span className='truncate max-w-xs'>{file.name}</span>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className='flex-shrink-0 p-1 hover:bg-green-100 rounded-full transition-colors duration-200'
                        title='Remove file'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Simplification Level */}
                <div className='space-y-2'>
                  <Label htmlFor='simplification-level' className='text-base font-medium'>
                    Simplification Level
                  </Label>
                  <Select value={simplificationLevel} onValueChange={setSimplificationLevel}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select simplification level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='8th'>8th Grade Level</SelectItem>
                      <SelectItem value='12th'>12th Grade Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='text-red-600 bg-red-50 p-3 rounded-md text-sm'
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simplify Button */}
                <Button
                  onClick={handleSimplify}
                  disabled={!file || isLoading}
                  className='w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50'
                >
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <Sparkles className='mr-2 h-5 w-5' />
                      Simplify Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                variants={itemVariants}
                className='mb-8'
              >
                <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-2xl'>
                      <Sparkles className='h-6 w-6 text-purple-600' />
                      Simplified Results
                    </CardTitle>
                    <CardDescription>
                      Your Terms of Service simplified to {simplificationLevel} grade level
                    </CardDescription>
                  </CardHeader>

                  {/* Playful Warning */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mx-6 mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg shadow-sm'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0'>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className='w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center'
                        >
                          <span className='text-amber-800 text-lg font-bold'>⚠️</span>
                        </motion.div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-amber-800 mb-1'>Heads up!</h4>
                        <p className='text-amber-700 text-sm leading-relaxed'>
                          These summaries are just simplified explanations to help you understand the document better.
                          They aren&apos;t legally binding, always check the original for the full details! 📋✨
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <CardContent>
                    <Tabs defaultValue={Object.keys(results)[0]} className='w-full'>
                      <TabsList className='grid w-full grid-cols-2 lg:grid-cols-4'>
                        {Object.keys(results).map((section) => (
                          <TabsTrigger key={section} value={section} className='text-sm'>
                            {section}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {Object.entries(results).map(([section, items]) => (
                        <TabsContent key={section} value={section} className='mt-6'>
                          <div className='space-y-3'>
                            {items.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                              >
                                <div className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5'>
                                  {index + 1}
                                </div>
                                <p className='text-gray-700 leading-relaxed'>{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='text-center py-4'
      >
        <div className='flex items-center justify-center gap-2 text-gray-600'>
          <span>Made with</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className='text-red-500 text-xl'
          >
            ❤️
          </motion.span>
          <span>by</span>
          <a
            href='https://samailabala.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline'
          >
            Samaila Bala
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
