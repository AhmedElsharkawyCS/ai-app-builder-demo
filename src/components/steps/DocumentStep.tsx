import { Box, Typography, Chip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import StepCard from '../StepCard';
import { useFormContext } from '../../context/FormContext';
import DocumentDropzone from '../DocumentDropzone';
import DocumentList from '../DocumentList';

const requiredDocs = [
  { category: 'Government ID', description: 'Passport, driver\'s license, or national ID card' },
  { category: 'Proof of Address', description: 'Utility bill or bank statement (last 3 months)' },
  { category: 'Business License', description: 'Certificate of incorporation or business registration' },
  { category: 'Bank Statement', description: 'Recent business bank statement' },
];

export default function DocumentStep() {
  const { formState } = useFormContext();

  const getDocStatus = (category: string) => {
    const doc = formState.documents.find((d) => d.category === category);
    if (!doc) return 'missing';
    return doc.status;
  };

  return (
    <StepCard
      icon={<DescriptionIcon />}
      title="Document Upload"
      subtitle="Upload required documents for identity and business verification"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Required documents:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {requiredDocs.map((doc) => {
            const status = getDocStatus(doc.category);
            return (
              <Box
                key={doc.category}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: status === 'uploaded' || status === 'verified' ? 'rgba(42,206,0,0.2)' : '#F2F2F2',
                  background: status === 'uploaded' || status === 'verified' ? 'rgba(42,206,0,0.03)' : 'transparent',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{doc.category}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{doc.description}</Typography>
                </Box>
                <Chip
                  label={status === 'missing' ? 'Required' : status === 'uploading' ? 'Uploading...' : 'Uploaded'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    bgcolor: status === 'missing' ? 'rgba(255,0,0,0.08)' : status === 'uploading' ? 'rgba(244,190,79,0.15)' : 'rgba(42,206,0,0.1)',
                    color: status === 'missing' ? 'error.main' : status === 'uploading' ? 'warning.main' : 'success.main',
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      <DocumentDropzone categories={requiredDocs.map((d) => d.category)} />

      {formState.documents.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Uploaded Files
          </Typography>
          <DocumentList />
        </Box>
      )}
    </StepCard>
  );
}
