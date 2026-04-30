import { Box } from '@mui/material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';

import { usePlatformStats } from '../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function TechnicalPlatformsSection() {
  const {
    data: platformData,
    isLoading: platformLoading,
    isError: platformError,
  } = usePlatformStats();

  return (
    <CategorySection
      title="Platform"
      description="Platform types serving different commerce needs"
      icon={<DeveloperBoardIcon />}
      accentColor="#7c3aed"
      defaultExpanded={false}
      storageKey="platform"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <MetricPair
          title="Commerce Platform"
          countLabel="Active"
          countValue={platformData?.commerce?.segments}
          countIcon={<StorefrontIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={platformData?.commerce?.sessions}
          sessionIcon={<BarChartIcon sx={{ fontSize: 18 }} />}
          accentColor="#3b82f6"
          isLoading={platformLoading}
          isError={platformError}
        />
        <MetricPair
          title="Billing Platform"
          countLabel="Active"
          countValue={platformData?.billing?.segments}
          countIcon={<PaymentIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={platformData?.billing?.sessions}
          sessionIcon={<ReceiptIcon sx={{ fontSize: 18 }} />}
          accentColor="#059669"
          isLoading={platformLoading}
          isError={platformError}
        />
        <MetricPair
          title="Retail Platform"
          countLabel="Active"
          countValue={platformData?.retail?.segments}
          countIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={platformData?.retail?.sessions}
          sessionIcon={<ShoppingBasketIcon sx={{ fontSize: 18 }} />}
          accentColor="#7c3aed"
          isLoading={platformLoading}
          isError={platformError}
        />
        <MetricPair
          title="App Commerce"
          countLabel="Active"
          countValue={platformData?.appCommerce?.segments}
          countIcon={<PhoneAndroidIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={platformData?.appCommerce?.sessions}
          sessionIcon={<MobileScreenShareIcon sx={{ fontSize: 18 }} />}
          accentColor="#ea580c"
          isLoading={platformLoading}
          isError={platformError}
        />
      </Box>
    </CategorySection>
  );
}
