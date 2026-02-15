import { Grid, TextField, MenuItem, Box, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import StepCard from '../StepCard';
import { useFormContext } from '../../context/FormContext';

const accountTypes = ['Checking', 'Savings', 'Business Checking', 'Business Savings'];

export default function BankStep() {
  const { formState, updateBank } = useFormContext();
  const bk = formState.bank;

  return (
    <StepCard
      icon={<AccountBalanceIcon />}
      title="Bank Account"
      subtitle="Add your bank details for payouts and settlements"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          mb: 3,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(42,206,0,0.05), rgba(42,206,0,0.02))',
          border: '1px solid rgba(42,206,0,0.15)',
        }}
      >
        <LockIcon sx={{ color: 'success.main', fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Bank details are encrypted with AES-256 and never stored in plain text. We use secure tokenization for all transactions.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Bank Name"
            fullWidth
            value={bk.bankName}
            onChange={(e) => updateBank({ bankName: e.target.value })}
            placeholder="e.g., Chase, Bank of America"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Account Holder Name"
            fullWidth
            value={bk.accountName}
            onChange={(e) => updateBank({ accountName: e.target.value })}
            placeholder="Name as it appears on the account"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Account Number"
            fullWidth
            value={bk.accountNumber}
            onChange={(e) => updateBank({ accountNumber: e.target.value })}
            placeholder="••••••••••"
            type="password"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Routing Number"
            fullWidth
            value={bk.routingNumber}
            onChange={(e) => updateBank({ routingNumber: e.target.value })}
            placeholder="9-digit routing number"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Account Type"
            select
            fullWidth
            value={bk.accountType}
            onChange={(e) => updateBank({ accountType: e.target.value })}
          >
            {accountTypes.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="SWIFT / BIC Code (optional)"
            fullWidth
            value={bk.swiftCode}
            onChange={(e) => updateBank({ swiftCode: e.target.value })}
            placeholder="For international transfers"
          />
        </Grid>
      </Grid>
    </StepCard>
  );
}
