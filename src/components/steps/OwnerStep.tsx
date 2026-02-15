import { Grid, TextField, MenuItem, Typography, Box, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import StepCard from '../StepCard';
import { useFormContext } from '../../context/FormContext';

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Other'];

export default function OwnerStep() {
  const { formState, updateOwner } = useFormContext();
  const o = formState.owner;

  return (
    <StepCard
      icon={<PersonIcon />}
      title="Owner Verification (KYC)"
      subtitle="We need to verify the identity of the business owner"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,         p: 2,
          mb: 3,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(109,75,203,0.06), rgba(20,125,197,0.06))',
          border: '1px solid rgba(109,75,203,0.1)',
        }}
      >
        <ShieldIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Your personal information is encrypted and securely stored. We comply with all KYC/AML regulations.
        </Typography>
        <Chip label="256-bit SSL" size="small" sx={{ bgcolor: 'rgba(42,206,0,0.1)', color: 'success.main', fontWeight: 600, fontSize: '0.7rem' }} />
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            fullWidth
            value={o.firstName}
            onChange={(e) => updateOwner({ firstName: e.target.value })}
            placeholder="Legal first name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            fullWidth
            value={o.lastName}
            onChange={(e) => updateOwner({ lastName: e.target.value })}
            placeholder="Legal last name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email Address"
            fullWidth
            type="email"
            value={o.email}
            onChange={(e) => updateOwner({ email: e.target.value })}
            placeholder="owner@business.com"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Phone Number"
            fullWidth
            value={o.phone}
            onChange={(e) => updateOwner({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            fullWidth
            type="date"
            value={o.dateOfBirth}
            onChange={(e) => updateOwner({ dateOfBirth: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Nationality"
            select
            fullWidth
            value={o.nationality}
            onChange={(e) => updateOwner({ nationality: e.target.value })}
          >
            {countries.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Street Address"
            fullWidth
            value={o.address}
            onChange={(e) => updateOwner({ address: e.target.value })}
            placeholder="123 Main Street, Apt 4B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="City"
            fullWidth
            value={o.city}
            onChange={(e) => updateOwner({ city: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="State / Province"
            fullWidth
            value={o.state}
            onChange={(e) => updateOwner({ state: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="ZIP / Postal Code"
            fullWidth
            value={o.zipCode}
            onChange={(e) => updateOwner({ zipCode: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Country"
            select
            fullWidth
            value={o.country}
            onChange={(e) => updateOwner({ country: e.target.value })}
          >
            {countries.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="SSN / National ID (last 4 digits)"
            fullWidth
            value={o.ssn}
            onChange={(e) => updateOwner({ ssn: e.target.value })}
            placeholder="••••"
            type="password"
          />
        </Grid>
      </Grid>
    </StepCard>
  );
}
