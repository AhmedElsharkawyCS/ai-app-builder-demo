import { Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import { useOrgStats } from '../../../queries/organizations.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function OrganizationsSection() {
  const {
    data: orgData,
    isLoading: orgLoading,
    isError: orgError,
  } = useOrgStats();

  return (
    <CategorySection
      title="Organizations"
      description="Organizations using the platform"
      icon={<BusinessIcon />}
      accentColor="#3b82f6"
      defaultExpanded={true}
      storageKey="organizations"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
        <MetricPair
          title="Organizations"
          countLabel="Active"
          countValue={orgData?.activeOrgs}
          countIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={orgData?.totalSessions}
          sessionIcon={<PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />}
          accentColor="#3b82f6"
          isLoading={orgLoading}
          isError={orgError}
        />
      </Box>
    </CategorySection>
  );
}
