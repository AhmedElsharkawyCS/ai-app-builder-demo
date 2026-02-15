import { useState } from 'react';
import { Box, Typography, MenuItem, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from '../context/FormContext';

interface DocumentDropzoneProps {
  categories: string[];
}

export default function DocumentDropzone({ categories }: DocumentDropzoneProps) {
  const { addDocument, updateDocument } = useFormContext();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      addDocument({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        category: selectedCategory,
      });

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          updateDocument(id, { progress: 100, status: 'uploaded' });
        } else {
          updateDocument(id, { progress: Math.round(progress) });
        }
      }, 400);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <Box>
      <TextField
        label="Document Category"
        select
        fullWidth
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        {categories.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : '#F2F2F2',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          background: isDragActive
            ? 'linear-gradient(135deg, rgba(109,75,203,0.06), rgba(20,125,197,0.06))'
            : 'rgba(249,249,249,0.5)',
          '&:hover': {
            borderColor: 'primary.light',
            background: 'linear-gradient(135deg, rgba(109,75,203,0.04), rgba(20,125,197,0.04))',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 44, color: isDragActive ? 'primary.main' : '#9F9F9F', mb: 1.5 }} />
        <Typography variant="body1" sx={{ fontWeight: 600, color: isDragActive ? 'primary.main' : 'text.primary' }}>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          or click to browse · PDF, JPG, PNG up to 10MB
        </Typography>
      </Box>
    </Box>
  );
}
