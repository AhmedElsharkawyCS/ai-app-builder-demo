import { Box, Typography, Skeleton, useTheme } from '@mui/material';

interface MetricRowProps {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  iconColor: string;
  isLoading: boolean;
  isError: boolean;
}

export function MetricRow({
  label,
  value,
  icon,
  iconColor,
  isLoading,
  isError,
}: MetricRowProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.125,
        px: 1,
        borderRadius: '6px',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },
      }}
    >
      <Box sx={{ color: iconColor, display: 'flex', flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography
        sx={{
          flex: 1,
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: theme.palette.text.secondary,
        }}
      >
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton variant="text" width={44} height={20} />
      ) : isError ? (
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
          —
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: theme.palette.text.primary,
            letterSpacing: '-0.25px',
          }}
        >
          {value?.toLocaleString() ?? '—'}
        </Typography>
      )}
    </Box>
  );
}
