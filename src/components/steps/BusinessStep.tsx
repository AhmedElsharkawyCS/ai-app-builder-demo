import { Grid, TextField, MenuItem } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import StepCard from '../StepCard';
import { useFormContext } from '../../context/FormContext';

const businessTypes = ['Sole Proprietorship', 'LLC', 'Corporation', 'Partnership', 'Non-Profit'];
const industries = ['Technology', 'Retail', 'Healthcare', 'Finance', 'Food & Beverage', 'Education', 'Real Estate', 'Other'];
const revenueBands = ['Under $50K', '$50K - $250K', '$250K - $1M', '$1M - $10M', '$10M+'];
const employeeBands = ['1-5', '6-20', '21-50', '51-200', '200+'];

export default function BusinessStep() {
  const { formState, updateBusiness } = useFormContext();
  const b = formState.business;

  return (
    <StepCard
      icon={<BusinessIcon />}
      title="Business Details"
      subtitle="Tell us about your business to get started"
    >
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Business Name"
            fullWidth
            value={b.businessName}
            onChange={(e) => updateBusiness({ businessName: e.target.value })}
            placeholder="Enter your registered business name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Business Type"
            select
            fullWidth
            value={b.businessType}
            onChange={(e) => updateBusiness({ businessType: e.target.value })}
          >
            {businessTypes.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Industry"
            select
            fullWidth
            value={b.industry}
            onChange={(e) => updateBusiness({ industry: e.target.value })}
          >
            {industries.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Registration Number"
            fullWidth
            value={b.registrationNumber}
            onChange={(e) => updateBusiness({ registrationNumber: e.target.value })}
            placeholder="e.g., EIN or business registration"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Tax ID"
            fullWidth
            value={b.taxId}
            onChange={(e) => updateBusiness({ taxId: e.target.value })}
            placeholder="e.g., 12-3456789"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Website"
            fullWidth
            value={b.website}
            onChange={(e) => updateBusiness({ website: e.target.value })}
            placeholder="https://yourbusiness.com"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Business Description"
            fullWidth
            multiline
            rows={3}
            value={b.description}
            onChange={(e) => updateBusiness({ description: e.target.value })}
            placeholder="Briefly describe what your business does..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Annual Revenue"
            select
            fullWidth
            value={b.annualRevenue}
            onChange={(e) => updateBusiness({ annualRevenue: e.target.value })}
          >
            {revenueBands.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Number of Employees"
            select
            fullWidth
            value={b.employeeCount}
            onChange={(e) => updateBusiness({ employeeCount: e.target.value })}
          >
            {employeeBands.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </StepCard>
  );
}
