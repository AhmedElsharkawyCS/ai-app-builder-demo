import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

import { useIndividualStats } from '../../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function IndividualsSection() {
  const {
    data: individualData,
    isLoading: individualLoading,
    isError: individualError,
  } = useIndividualStats();

  return (
    <CategorySection
      title="Individuals"
      description="Individuals using the platform"
      icon={<PersonIcon />}
      accentColor="#7c3aed"
      defaultExpanded={true}
      storageKey="individuals"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
        <MetricPair
          title="Individuals"
          countLabel="Active"
          countValue={individualData?.uniqueIndividuals}
          countIcon={<PersonIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={individualData?.totalSessions}
          sessionIcon={<GroupsIcon sx={{ fontSize: 18 }} />}
          accentColor="#7c3aed"
          isLoading={individualLoading}
          isError={individualError}
        />
      </Box>
    </CategorySection>
  );
}
