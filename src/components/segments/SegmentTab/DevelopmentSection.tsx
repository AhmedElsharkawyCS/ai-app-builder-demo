import { Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useDevelopmentStats } from '../../../queries/business.queries';
import { CategorySection } from './CategorySection';
import { MetricPair } from './MetricPair';

export function DevelopmentSection() {
  const {
    data: developmentData,
    isLoading: developmentLoading,
    isError: developmentError,
  } = useDevelopmentStats();

  return (
    <CategorySection
      title="Development"
      description="Development houses and freelancers"
      icon={<CodeIcon />}
      accentColor="#7c3aed"
      defaultExpanded={true}
      storageKey="development"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <MetricPair
          title="Development House"
          countLabel="Active"
          countValue={developmentData?.developmentHouse?.segments}
          countIcon={<CodeIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={developmentData?.developmentHouse?.sessions}
          sessionIcon={<BarChartIcon sx={{ fontSize: 18 }} />}
          accentColor="#7c3aed"
          isLoading={developmentLoading}
          isError={developmentError}
        />
        <MetricPair
          title="Freelance Developer"
          countLabel="Active"
          countValue={developmentData?.freelanceDeveloper?.segments}
          countIcon={<PersonIcon sx={{ fontSize: 18 }} />}
          sessionLabel="Sessions"
          sessionValue={developmentData?.freelanceDeveloper?.sessions}
          sessionIcon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
          accentColor="#10b981"
          isLoading={developmentLoading}
          isError={developmentError}
        />
      </Box>
    </CategorySection>
  );
}
