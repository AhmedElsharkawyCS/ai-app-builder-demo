import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function SuccessScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f0ff 0%, #e8f4fd 50%, #f9f9f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Box
          sx={{
            maxWidth: 520,
            textAlign: 'center',
            background: '#fff',
            borderRadius: '24px',
            p: { xs: 4, md: 6 },
            boxShadow: '0 8px 48px rgba(0,0,0,0.06)',
            border: '1px solid #F2F2F2',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(42,206,0,0.12), rgba(42,206,0,0.04))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main' }} />
            </Box>
          </motion.div>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
            Application Submitted!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
            Thank you for completing your merchant onboarding. Our team will review your application and documents within 1-2 business days.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(249,249,249,0.7)',
                border: '1px solid #F2F2F2',
              }}
            >
              <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                You'll receive a confirmation email shortly with your application reference number.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(249,249,249,0.7)',
                border: '1px solid #F2F2F2',
              }}
            >
              <AccessTimeIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                Typical review takes{' '}24-48 hours. We'll notify you of any updates via email.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              p: 2,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(109,75,203,0.06), rgba(20,125,197,0.06))',
              border: '1px solid rgba(109,75,203,0.1)',
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Application ID:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: '0.05em',
              }}
            >
              MRO-{Date.now().toString(36).toUpperCase().slice(0, 8)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.reload()}
            sx={{
              background: 'linear-gradient(135deg, #6D4BCB, #147DC5)',
              boxShadow: '0 4px 20px rgba(109,75,203,0.35)',
              px: 5,
              '&:hover': {
                background: 'linear-gradient(135deg, #5535A8, #0E5F96)',
                boxShadow: '0 6px 28px rgba(109,75,203,0.45)',
              },
            }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
