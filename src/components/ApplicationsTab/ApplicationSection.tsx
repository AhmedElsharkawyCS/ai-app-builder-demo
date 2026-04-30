import { Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useAppServices } from '../../queries/applications.queries';
import { getAppMetadata } from '../../utils/applicationHelpers';
import { CategorySection } from '../SegmentTab/CategorySection';
import { MetricPair } from '../SegmentTab/MetricPair';

interface ApplicationSectionProps {
  appCode: string;
  serviceCount: number;
}

/**
 * Format service name by replacing underscores with spaces and capitalizing words
 * Example: "ONLINE_COMMERCE_WALLET" → "Online Commerce Wallet"
 */
function formatServiceName(serviceName: string): string {
  return serviceName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ApplicationSection({ appCode, serviceCount }: ApplicationSectionProps) {
  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useAppServices(appCode);

  const { icon, color, displayName } = getAppMetadata(appCode);

  const description = `${serviceCount} ${serviceCount === 1 ? 'service' : 'services'}`;

  // Determine grid layout based on number of services
  const gridColumns = servicesData?.services.length === 1 ? '1fr' : 'repeat(2, 1fr)';

  return (
    <CategorySection
      title={displayName}
      description={description}
      icon={icon}
      accentColor={color}
      defaultExpanded={false}
      storageKey={`app-${appCode}`}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: gridColumns, gap: 2 }}>
        {servicesData?.services.map((service) => (
          <MetricPair
            key={service.serviceName}
            title={formatServiceName(service.serviceName)}
            countLabel="Active"
            countValue={service.active}
            countIcon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
            sessionLabel="Sessions"
            sessionValue={service.sessions}
            sessionIcon={<BarChartIcon sx={{ fontSize: 18 }} />}
            accentColor={color}
            isLoading={servicesLoading}
            isError={servicesError}
          />
        ))}
      </Box>
    </CategorySection>
  );
}
