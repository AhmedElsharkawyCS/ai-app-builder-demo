import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import type { FilterConfig, FilterOption, TimePeriod } from '../../types/dashboard.types';

interface FilterBarProps {
  filters: FilterConfig[];
  filterValues: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  tabKey: string;
  dynamicOptions?: Record<string, { options: FilterOption[]; isLoading: boolean }>;
}

const TIME_PERIODS: TimePeriod[] = ['1H', '4H', '1D', '1W', '1M'];

export function FilterBar({
  filters,
  filterValues,
  onFilterChange,
  timePeriod,
  onTimePeriodChange,
  tabKey,
  dynamicOptions,
}: FilterBarProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const hasFilters = filters.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: hasFilters ? 'space-between' : 'flex-end',
        px: 3,
        py: 1.25,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 56,
        gap: 2,
        flexWrap: 'wrap',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Left: Tab-specific filters — only shown when there are filters */}
      {hasFilters && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', flexShrink: 0 }}>
            <FilterListIcon sx={{ fontSize: 18, color: '#147dc5' }} />
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={tabKey}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              {filters.map((filter) => {
                const dynamic = dynamicOptions?.[filter.id];
                const resolvedOptions = dynamic ? dynamic.options : filter.options;
                const isLoading = dynamic?.isLoading ?? false;

                return (
                  <TabFilter
                    key={filter.id}
                    filter={{ ...filter, options: resolvedOptions }}
                    value={filterValues[filter.id] ?? ''}
                    onChange={(val) => onFilterChange(filter.id, val)}
                    isLoading={isLoading}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </Box>
      )}

      {/* Divider — only shown when there are filters */}
      {hasFilters && <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />}

      {/* Right: Time period selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
        <AccessTimeIcon sx={{ fontSize: 18, color: '#147dc5' }} />
        <ToggleButtonGroup
          value={timePeriod}
          exclusive
          onChange={(_, val) => val && onTimePeriodChange(val as TimePeriod)}
          size="small"
          aria-label="Time period"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px !important',
              mx: 0.25,
              px: 1.5,
              py: 0.4,
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'none',
              transition: 'all 0.15s ease',
              '&.Mui-selected': {
                backgroundColor: '#147dc5',
                color: '#ffffff',
                borderColor: '#147dc5',
                '&:hover': {
                  backgroundColor: '#3da6e1',
                  borderColor: '#3da6e1',
                },
              },
              '&:hover': {
                backgroundColor: isLight ? '#f0f7fd' : 'rgba(20,125,197,0.15)',
                color: '#147dc5',
                borderColor: isLight ? '#b4d9eb' : '#147dc5',
              },
            },
          }}
        >
          {TIME_PERIODS.map((p) => (
            <ToggleButton key={p} value={p} aria-label={p}>
              {p}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

interface TabFilterProps {
  filter: FilterConfig;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

function TabFilter({ filter, value, onChange, isLoading }: TabFilterProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 130,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          fontSize: '0.8125rem',
          backgroundColor: isLight ? '#f9fafb' : 'rgba(255,255,255,0.05)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3da6e1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#147dc5',
            borderWidth: 1.5,
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.8125rem',
          '&.Mui-focused': { color: '#147dc5' },
        },
      }}
    >
      <InputLabel id={`filter-${filter.id}-label`}>{filter.label}</InputLabel>
      <Select
        labelId={`filter-${filter.id}-label`}
        value={value}
        label={filter.label}
        onChange={(e) => onChange(e.target.value)}
        endAdornment={
          isLoading ? (
            <CircularProgress size={16} sx={{ mr: 2.5, color: '#147dc5' }} />
          ) : undefined
        }
      >
        {filter.options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8125rem' }}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}