import { Box, Typography, Chip } from '@mui/material';

interface ReviewItem {
  label: string;
  value: string;
  badge?: string;
}

interface ReviewSectionProps {
  title: string;
  items: ReviewItem[];
  emptyMessage?: string;
}

export default function ReviewSection({ title, items, emptyMessage }: ReviewSectionProps) {
  const filledItems = items.filter((item) => item.value);

  return (
    <Box
      sx={{
        borderRadius: '14px',
        border: '1px solid #F2F2F2',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: 'rgba(249,249,249,0.7)',
          borderBottom: '1px solid #F2F2F2',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>
        {filledItems.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {emptyMessage || 'No information provided'}
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            {filledItems.map((item) => (
              <Box key={item.label}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {item.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        bgcolor: 'rgba(42,206,0,0.1)',
                        color: 'success.main',
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
