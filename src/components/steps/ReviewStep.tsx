import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StepCard from '../StepCard';
import { useFormContext } from '../../context/FormContext';
import ReviewSection from '../ReviewSection';

export default function ReviewStep() {
  const { formState, setAgreedToTerms } = useFormContext();
  const { business, owner, documents, bank } = formState;

  return (
    <StepCard
      icon={<RateReviewIcon />}
      title="Review & Submit"
      subtitle="Please review all your information before submitting"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <ReviewSection
          title="Business Details"
          items={[
            { label: 'Business Name', value: business.businessName },
            { label: 'Type', value: business.businessType },
            { label: 'Industry', value: business.industry },
            { label: 'Registration #', value: business.registrationNumber },
            { label: 'Tax ID', value: business.taxId },
            { label: 'Website', value: business.website },
            { label: 'Revenue', value: business.annualRevenue },
            { label: 'Employees', value: business.employeeCount },
          ]}
        />

        <ReviewSection
          title="Owner Information"
          items={[
            { label: 'Name', value: `${owner.firstName} ${owner.lastName}`.trim() },
            { label: 'Email', value: owner.email },
            { label: 'Phone', value: owner.phone },
            { label: 'Date of Birth', value: owner.dateOfBirth },
            { label: 'Nationality', value: owner.nationality },
            { label: 'Address', value: [owner.address, owner.city, owner.state, owner.zipCode].filter(Boolean).join(', ') },
            { label: 'Country', value: owner.country },
          ]}
        />

        <ReviewSection
          title="Documents"
          items={documents.map((doc) => ({
            label: doc.category,
            value: doc.name,
            badge: doc.status === 'uploaded' ? 'Uploaded' : doc.status,
          }))}
          emptyMessage="No documents uploaded yet"
        />

        <ReviewSection
          title="Bank Account"
          items={[
            { label: 'Bank', value: bank.bankName },
            { label: 'Account Holder', value: bank.accountName },
            { label: 'Account Number', value: bank.accountNumber ? `••••${bank.accountNumber.slice(-4)}` : '' },
            { label: 'Routing Number', value: bank.routingNumber },
            { label: 'Account Type', value: bank.accountType },
          ]}
        />

        <Box
          sx={{
            mt: 1,
            p: 2.5,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(109,75,203,0.04), rgba(20,125,197,0.04))',
            border: '1px solid rgba(109,75,203,0.1)',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': { color: 'primary.main' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I confirm that all information provided is accurate and complete. I agree to the{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
                  Terms of Service
                </Box>{' '}
                and{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
                  Privacy Policy
                </Box>
                , and consent to KYC/AML verification checks.
              </Typography>
            }
          />
        </Box>
      </Box>
    </StepCard>
  );
}
