import { Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PolicyIcon from '@mui/icons-material/Policy';

import { useRegulatorStats } from '../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function RegulatoryOversightSection() {
  const {
    data: regulatorData,
    isLoading: regulatorLoading,
    isError: regulatorError,
  } = useRegulatorStats();

  return (
    <CategorySection
      title="Regulators"
      description="Regulatory bodies and compliance"
      icon={<GavelIcon />}
      accentColor="#dc2626"
      defaultExpanded={false}
      storageKey="regulators"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <MetricPair
          title="Commercial Regulator"
          countLabel="Active"
          countValue={regulatorData?.commercial?.segments}
          countIcon={<GavelIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={regulatorData?.commercial?.sessions}
          sessionIcon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
          accentColor="#dc2626"
          isLoading={regulatorLoading}
          isError={regulatorError}
        />
        <MetricPair
          title="Financial Regulator"
          countLabel="Active"
          countValue={regulatorData?.financial?.segments}
          countIcon={<AccountBalanceIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={regulatorData?.financial?.sessions}
          sessionIcon={<PolicyIcon sx={{ fontSize: 18 }} />}
          accentColor="#059669"
          isLoading={regulatorLoading}
          isError={regulatorError}
        />
      </Box>
    </CategorySection>
  );
}
