import { Box, Typography, useTheme } from '@mui/material';
import { MetricRow } from './MetricRow';

interface MetricPairProps {
  title: string;
  countLabel: string;
  countValue: number | undefined;
  countIcon: React.ReactNode;
  sessionLabel: string;
  sessionValue: number | undefined;
  sessionIcon: React.ReactNode;
  accentColor: string;
  isLoading: boolean;
  isError: boolean;
}

export function MetricPair({
  title,
  countLabel,
  countValue,
  countIcon,
  sessionLabel,
  sessionValue,
  sessionIcon,
  accentColor,
  isLoading,
  isError,
}: MetricPairProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '8px',
        border: '1px solid',
        borderColor: theme.palette.divider,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          backgroundColor: `${accentColor}08`,
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Metrics */}
      <Box sx={{ p: 0.5 }}>
        <MetricRow
          label={countLabel}
          value={countValue}
          icon={countIcon}
          iconColor={accentColor}
          isLoading={isLoading}
          isError={isError}
        />
        <MetricRow
          label={sessionLabel}
          value={sessionValue}
          icon={sessionIcon}
          iconColor={accentColor}
          isLoading={isLoading}
          isError={isError}
        />
      </Box>
    </Box>
  );
}
