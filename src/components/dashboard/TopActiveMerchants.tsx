import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import {
  Paper,
  Typography,
  Box,
  Skeleton,
  Alert,
  Button,
  Avatar,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

import { useTopActiveMerchants } from '../../queries/dashboard.queries';
import { formatNumber } from '../../utils/format';
import type { TimePeriod } from '../../types/dashboard.types';

interface TopActiveMerchantsProps {
  timePeriod: TimePeriod;
  selectedBrand?: string | null;
  onSelectBrand?: (brand: string | null) => void;
}

const MEDAL_GRADIENTS = [
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #94a3b8, #cbd5e1)',
  'linear-gradient(135deg, #d97706, #f97316)',
];

const MEDAL_SHADOWS = [
  '0 2px 8px rgba(245,158,11,0.4)',
  '0 2px 8px rgba(148,163,184,0.4)',
  '0 2px 8px rgba(217,119,6,0.4)',
];

export function TopActiveMerchants({ timePeriod, selectedBrand, onSelectBrand }: TopActiveMerchantsProps) {
  const { data, isLoading, isError, refetch } = useTopActiveMerchants(timePeriod);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!data) return [];

    // When a brand is selected, show only that brand
    if (selectedBrand) {
      return data.filter((m) => {
        const brand = m.Brand || m.facet || '';
        return brand === selectedBrand;
      });
    }

    if (!searchQuery.trim()) return data;
    const q = searchQuery.trim().toLowerCase();
    return data.filter((m) => {
      const brand = m.Brand || m.facet || '';
      return brand.toLowerCase().includes(q);
    });
  }, [data, selectedBrand, searchQuery]);

  // Find the original index of a merchant in the full data for medal display
  const getOriginalIndex = (merchant: typeof data extends (infer T)[] ? T : never) => {
    if (!data) return -1;
    return data.findIndex((m) => (m.Brand || m.facet) === (merchant.Brand || merchant.facet));
  };

  const handleRowClick = (brand: string) => {
    if (!onSelectBrand) return;
    onSelectBrand(selectedBrand === brand ? null : brand);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        background: isLight
          ? 'linear-gradient(135deg, #ffffff 0%, #fffcf5 100%)'
          : 'linear-gradient(135deg, #161b22 0%, #1e2028 100%)',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <EmojiEventsIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }} noWrap>
          Top Active Merchants
        </Typography>
        {selectedBrand && (
          <Chip
            label={selectedBrand}
            size="small"
            onDelete={() => onSelectBrand?.(null)}
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              backgroundColor: isLight ? 'rgba(20,125,197,0.1)' : 'rgba(61,166,225,0.18)',
              color: '#147dc5',
              '& .MuiChip-deleteIcon': {
                color: '#147dc5',
                fontSize: 16,
                '&:hover': { color: '#0d5a8f' },
              },
            }}
          />
        )}
      </Box>

      {/* Show search bar only when no brand is selected */}
      {!selectedBrand && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by Brand name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch} sx={{ p: 0.25 }}>
                    <ClearIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                fontSize: '0.8rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#147dc5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#147dc5',
                  borderWidth: '1.5px',
                },
              },
            }}
          />
        </Box>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: '8px' }} />
          ))}
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={<Button size="small" onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load top merchants
        </Alert>
      ) : filteredData.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          {searchQuery.trim()
            ? `No merchants found matching "${searchQuery.trim()}".`
            : 'No merchant activity found for this period.'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, overflow: 'auto' }}>
          {filteredData.map((merchant, i) => {
            const brand = merchant.Brand || merchant.facet || 'Unknown';
            const isSelected = selectedBrand === brand;
            const originalIdx = getOriginalIndex(merchant);

            return (
              <motion.div
                key={merchant.facet || i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Box
                  onClick={() => handleRowClick(brand)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: isSelected ? '#147dc5' : 'transparent',
                    backgroundColor: isSelected
                      ? (isLight ? 'rgba(20,125,197,0.08)' : 'rgba(20,125,197,0.16)')
                      : originalIdx < 3
                        ? (isLight ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.08)')
                        : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isSelected
                        ? (isLight ? 'rgba(20,125,197,0.12)' : 'rgba(20,125,197,0.22)')
                        : (isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.14)'),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: originalIdx < 3 ? MEDAL_GRADIENTS[originalIdx] : (isLight ? '#e8ecf4' : '#30363d'),
                      color: originalIdx < 3 ? '#fff' : 'text.secondary',
                      boxShadow: originalIdx < 3 ? MEDAL_SHADOWS[originalIdx] : 'none',
                    }}
                  >
                    {originalIdx + 1}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {brand}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${formatNumber(merchant.count)} events`}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      backgroundColor: isSelected
                        ? (isLight ? 'rgba(20,125,197,0.15)' : 'rgba(20,125,197,0.25)')
                        : (isLight ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.18)'),
                      color: isSelected ? '#147dc5' : '#6366f1',
                    }}
                  />
                </Box>
              </motion.div>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}