import { Box } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BusinessIcon from '@mui/icons-material/Business';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InsertChartIcon from '@mui/icons-material/InsertChart';

import { useBusinessStats } from '../../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function BusinessSection() {
  const {
    data: businessData,
    isLoading: businessLoading,
    isError: businessError,
  } = useBusinessStats();

  return (
    <CategorySection
      title="Business"
      description="Merchants and marketplaces"
      icon={<StorefrontIcon />}
      accentColor="#059669"
      defaultExpanded={true}
      storageKey="business-types"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <MetricPair
          title="Merchant"
          countLabel="Active"
          countValue={businessData?.merchantsBusiness}
          countIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={businessData?.sessionsBusiness}
          sessionIcon={<EventNoteIcon sx={{ fontSize: 18 }} />}
          accentColor="#3b82f6"
          isLoading={businessLoading}
          isError={businessError}
        />
        <MetricPair
          title="Marketplace"
          countLabel="Active"
          countValue={businessData?.merchantsMarketplace}
          countIcon={<StorefrontIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={businessData?.sessionsMarketplace}
          sessionIcon={<InsertChartIcon sx={{ fontSize: 18 }} />}
          accentColor="#059669"
          isLoading={businessLoading}
          isError={businessError}
        />
      </Box>
    </CategorySection>
  );
}
