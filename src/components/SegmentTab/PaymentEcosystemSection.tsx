import { Box } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import LockIcon from '@mui/icons-material/Lock';
import TerminalIcon from '@mui/icons-material/Terminal';
import StoreIcon from '@mui/icons-material/Store';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { usePaymentStats } from '../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function PaymentEcosystemSection() {
  const {
    data: paymentData,
    isLoading: paymentLoading,
    isError: paymentError,
  } = usePaymentStats();

  return (
    <CategorySection
      title="Payment Providers"
      description="Payment service providers and infrastructure"
      icon={<PaymentIcon />}
      accentColor="#ea580c"
      defaultExpanded={false}
      storageKey="payment-providers"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <MetricPair
          title="Payment Acquirer"
          countLabel="Active"
          countValue={paymentData?.acquirer?.segments}
          countIcon={<CreditCardIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.acquirer?.sessions}
          sessionIcon={<ReceiptIcon sx={{ fontSize: 18 }} />}
          accentColor="#4f46e5"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Facilitator"
          countLabel="Active"
          countValue={paymentData?.facilitator?.segments}
          countIcon={<AccountBalanceIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.facilitator?.sessions}
          sessionIcon={<PaymentsIcon sx={{ fontSize: 18 }} />}
          accentColor="#14b8a6"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Gateway"
          countLabel="Active"
          countValue={paymentData?.gateway?.segments}
          countIcon={<VpnKeyIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.gateway?.sessions}
          sessionIcon={<LockIcon sx={{ fontSize: 18 }} />}
          accentColor="#06b6d4"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Technology"
          countLabel="Active"
          countValue={paymentData?.technology?.segments}
          countIcon={<CodeIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.technology?.sessions}
          sessionIcon={<TerminalIcon sx={{ fontSize: 18 }} />}
          accentColor="#d946ef"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Technology Orchestration Provider"
          countLabel="Active"
          countValue={paymentData?.orchestration?.segments}
          countIcon={<HubIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.orchestration?.sessions}
          sessionIcon={<AccountTreeIcon sx={{ fontSize: 18 }} />}
          accentColor="#8b5cf6"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Issuer"
          countLabel="Active"
          countValue={paymentData?.issuer?.segments}
          countIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.issuer?.sessions}
          sessionIcon={<StoreIcon sx={{ fontSize: 18 }} />}
          accentColor="#f59e0b"
          isLoading={paymentLoading}
          isError={paymentError}
        />
        <MetricPair
          title="Payment Scheme"
          countLabel="Active"
          countValue={paymentData?.scheme?.segments}
          countIcon={<CategoryIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={paymentData?.scheme?.sessions}
          sessionIcon={<InsertChartIcon sx={{ fontSize: 18 }} />}
          accentColor="#84cc16"
          isLoading={paymentLoading}
          isError={paymentError}
        />
      </Box>
    </CategorySection>
  );
}
