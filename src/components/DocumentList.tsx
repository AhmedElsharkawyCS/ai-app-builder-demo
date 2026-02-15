import { Box, Typography, IconButton, LinearProgress, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useFormContext } from '../context/FormContext';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList() {
  const { formState, removeDocument } = useFormContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {formState.documents.map((doc) => (
        <Box
          key={doc.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '12px',
            border: '1px solid #F2F2F2',
            background: '#fff',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(109,75,203,0.08), rgba(20,125,197,0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <InsertDriveFileIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.name}
              </Typography>
              <Chip label={doc.category} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatSize(doc.size)}
            </Typography>
            {doc.status === 'uploading' && (
              <LinearProgress
                variant="determinate"
                value={doc.progress}
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(109,75,203,0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #6D4BCB, #147DC5)',
                    borderRadius: 2,
                  },
                }}
              />
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => removeDocument(doc.id)}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main', bgcolor: 'rgba(255,0,0,0.06)' },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
