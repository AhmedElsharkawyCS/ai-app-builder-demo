import { useMemo } from 'react';
import { Box, Typography, Paper, Skeleton, useTheme } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import ExtensionIcon from '@mui/icons-material/Extension';

import { useApplications } from '../../queries/applications.queries';
import { FilterBar } from '../common/FilterBar';
import { ApplicationSection } from './ApplicationSection';

export function ApplicationsTab() {
  const { data: applications, isLoading: appsLoading } = useApplications();

  // Calculate summary metrics
  const { totalApps, totalServices, anyLoading } = useMemo(() => {
    const apps = applications?.length ?? 0;
    const services = applications?.reduce((sum, app) => sum + app.serviceCount, 0) ?? 0;

    return {
      totalApps: apps,
      totalServices: services,
      anyLoading: appsLoading,
    };
  }, [applications, appsLoading]);

  const theme = useTheme();

  const renderSummaryCard = (
    label: string,
    value: number | undefined,
    icon: React.ReactNode,
    color: string
  ) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '8px',
        p: 2,
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        flex: 1,
        minWidth: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 2px 8px ${color}15`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            color: color,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        {anyLoading ? (
          <Skeleton variant="text" width={80} height={32} />
        ) : (
          <Typography
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}
          >
            {value?.toLocaleString() ?? '—'}
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Filter Bar */}
      <FilterBar />

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 3,
          pb: 3,
        }}
      >
        {/* Summary Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            {renderSummaryCard(
              'Active Applications',
              totalApps,
              <AppsIcon sx={{ fontSize: 24 }} />,
              '#3b82f6'
            )}
            {renderSummaryCard(
              'Total Services',
              totalServices,
              <ExtensionIcon sx={{ fontSize: 24 }} />,
              '#059669'
            )}
          </Box>
        </Box>

        {/* Application Sections Container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {applications?.map((app) => (
            <ApplicationSection
              key={app.appCode}
              appCode={app.appCode}
              serviceCount={app.serviceCount}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
