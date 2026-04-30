import { useMemo } from 'react';
import { Box } from '@mui/material';

import { useOrgStats } from '../../../queries/organizations.queries';
import {
  useBusinessStats,
  useDevelopmentStats,
  usePlatformStats,
  usePaymentStats,
  useRegulatorStats,
  useIndividualStats,
} from '../../../queries/business.queries';

import { FilterBar } from '../../common/FilterBar';
import { SummarySection } from './SummarySection';
import { OrganizationsSection } from './OrganizationsSection';
import { IndividualsSection } from './IndividualsSection';
import { BusinessSection } from './BusinessSection';
import { DevelopmentSection } from './DevelopmentSection';
import { TechnicalPlatformsSection } from './TechnicalPlatformsSection';
import { PaymentEcosystemSection } from './PaymentEcosystemSection';
import { RegulatoryOversightSection } from './RegulatoryOversightSection';

export function SegmentTab() {
  const { data: orgData, isLoading: orgLoading } = useOrgStats();
  const { data: businessData, isLoading: businessLoading } = useBusinessStats();
  const { data: developmentData, isLoading: developmentLoading } = useDevelopmentStats();
  const { data: platformData, isLoading: platformLoading } = usePlatformStats();
  const { data: paymentData, isLoading: paymentLoading } = usePaymentStats();
  const { data: regulatorData, isLoading: regulatorLoading } = useRegulatorStats();
  const { data: individualData, isLoading: individualLoading } = useIndividualStats();

  // Calculate totals for summary section
  const { totalSegments, totalSessions, anyLoading } = useMemo(() => {
    const segments =
      (orgData?.activeOrgs ?? 0) +
      (businessData?.merchantsBusiness ?? 0) +
      (businessData?.merchantsMarketplace ?? 0) +
      (developmentData?.developmentHouse?.segments ?? 0) +
      (developmentData?.freelanceDeveloper?.segments ?? 0) +
      (platformData?.commerce?.segments ?? 0) +
      (platformData?.billing?.segments ?? 0) +
      (platformData?.retail?.segments ?? 0) +
      (platformData?.appCommerce?.segments ?? 0) +
      (paymentData?.acquirer?.segments ?? 0) +
      (paymentData?.facilitator?.segments ?? 0) +
      (paymentData?.gateway?.segments ?? 0) +
      (paymentData?.technology?.segments ?? 0) +
      (paymentData?.orchestration?.segments ?? 0) +
      (paymentData?.issuer?.segments ?? 0) +
      (paymentData?.scheme?.segments ?? 0) +
      (regulatorData?.commercial?.segments ?? 0) +
      (regulatorData?.financial?.segments ?? 0) +
      (individualData?.uniqueIndividuals ?? 0);

    const sessions =
      (orgData?.totalSessions ?? 0) +
      (businessData?.sessionsBusiness ?? 0) +
      (businessData?.sessionsMarketplace ?? 0) +
      (developmentData?.developmentHouse?.sessions ?? 0) +
      (developmentData?.freelanceDeveloper?.sessions ?? 0) +
      (platformData?.commerce?.sessions ?? 0) +
      (platformData?.billing?.sessions ?? 0) +
      (platformData?.retail?.sessions ?? 0) +
      (platformData?.appCommerce?.sessions ?? 0) +
      (paymentData?.acquirer?.sessions ?? 0) +
      (paymentData?.facilitator?.sessions ?? 0) +
      (paymentData?.gateway?.sessions ?? 0) +
      (paymentData?.technology?.sessions ?? 0) +
      (paymentData?.orchestration?.sessions ?? 0) +
      (paymentData?.issuer?.sessions ?? 0) +
      (paymentData?.scheme?.sessions ?? 0) +
      (regulatorData?.commercial?.sessions ?? 0) +
      (regulatorData?.financial?.sessions ?? 0) +
      (individualData?.totalSessions ?? 0);

    const loading =
      orgLoading ||
      businessLoading ||
      developmentLoading ||
      platformLoading ||
      paymentLoading ||
      regulatorLoading ||
      individualLoading;

    return {
      totalSegments: segments,
      totalSessions: sessions,
      anyLoading: loading,
    };
  }, [
    orgData,
    businessData,
    developmentData,
    platformData,
    paymentData,
    regulatorData,
    individualData,
    orgLoading,
    businessLoading,
    developmentLoading,
    platformLoading,
    paymentLoading,
    regulatorLoading,
    individualLoading,
  ]);

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
        <SummarySection
          totalSegments={totalSegments}
          totalSessions={totalSessions}
          isLoading={anyLoading}
        />

        {/* Category Sections Container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <OrganizationsSection />
          <IndividualsSection />
          <BusinessSection />
          <DevelopmentSection />
          <TechnicalPlatformsSection />
          <PaymentEcosystemSection />
          <RegulatoryOversightSection />
        </Box>
      </Box>
    </Box>
  );
}
