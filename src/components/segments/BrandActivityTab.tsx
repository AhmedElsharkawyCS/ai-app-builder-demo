import React, { useState, useCallback, useMemo } from 'react';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  TextField,
  Autocomplete,
  useTheme,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useSegmentActivity, useSegmentActivityCount, useUniqueBrands } from '../../queries/brand-activity.queries';
import { FilterBar } from '../common/FilterBar';
import { BrandSessionsDrawer } from './BrandSessionsDrawer';
import type { SegmentActivity } from '../../types/segments.types';
import { DATE_PRESETS, isoFromOffset, type DatePreset } from '../../utils/datePresets';
import {
  BRAND_ACTIVITY_PER_PAGE,
  BRAND_ACTIVITY_ROW_HEIGHT,
  BRAND_ACTIVITY_VISIBLE_ROWS,
  BRAND_ACTIVITY_TABLE_HEADERS
} from '../../utils/constants';

export function BrandActivityTab() {
  const theme = useTheme();
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [brandInputValue, setBrandInputValue] = useState('');
  const [datePreset, setDatePreset] = useState<DatePreset>('24h');
  const [page, setPage] = useState(1);
  const [brandDrawer, setBrandDrawer] = useState<{ open: boolean; brand: string }>({
    open: false,
    brand: '',
  });

  const sinceDate = useMemo(() => {
    const preset = DATE_PRESETS.find((p) => p.value === datePreset);
    return preset ? isoFromOffset(preset.offsetMs) : undefined;
  }, [datePreset]);

  const { data: brands, isLoading: brandsLoading } = useUniqueBrands();
  const { data: totalCount, isLoading: countLoading } = useSegmentActivityCount(sinceDate, brandFilter ?? undefined);
  const { data, isLoading, isError } = useSegmentActivity(sinceDate, brandFilter ?? undefined, page, BRAND_ACTIVITY_PER_PAGE);

  const rows = useMemo(() => data ?? [], [data]);
  const total = totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / BRAND_ACTIVITY_PER_PAGE));

  const handlePresetChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, value: DatePreset | null) => {
      if (value) {
        setDatePreset(value);
        setPage(1);
      }
    },
    []
  );

  const handleBrandChange = useCallback((_: React.SyntheticEvent, newValue: string | null) => {
    setBrandFilter(newValue);
    setPage(1);
  }, []);

  const handleClearAll = () => {
    setBrandFilter(null);
    setBrandInputValue('');
    setDatePreset('24h');
    setPage(1);
  };

  const hasActiveFilters = !!(brandFilter || datePreset !== '24h');

  const openBrandDrawer = (row: SegmentActivity) => {
    setBrandDrawer({ open: true, brand: row.first_brand_name });
  };

  const startIndex = (page - 1) * BRAND_ACTIVITY_PER_PAGE + 1;
  const endIndex = Math.min(page * BRAND_ACTIVITY_PER_PAGE, total);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* ── Filter Panel ── */}
      <FilterBar>
        <Autocomplete
          size="small"
          options={brands ?? []}
          value={brandFilter}
          inputValue={brandInputValue}
          onInputChange={(_, newInputValue) => setBrandInputValue(newInputValue)}
          onChange={handleBrandChange}
          loading={brandsLoading}
          loadingText="Loading brands…"
          noOptionsText="No brands found"
          clearOnEscape
          sx={{
            flex: '1 1 180px',
            maxWidth: 280,
            '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.8125rem' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search brand…"
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.8125rem' },
                '& .MuiInputBase-input::placeholder': { fontSize: '0.8125rem' },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ fontSize: '0.8125rem', py: '6px !important', px: '12px !important' }}
            >
              {option}
            </Box>
          )}
          ListboxProps={{
            style: { maxHeight: 260, fontSize: '0.8125rem' },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '10px',
                mt: 0.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
              },
            },
          }}
        />

        <ToggleButtonGroup
          value={datePreset}
          exclusive
          onChange={handlePresetChange}
          size="small"
          sx={{ gap: '4px' }}
        >
          {DATE_PRESETS.map((p) => (
            <ToggleButton key={p.value} value={p.value}>
              {p.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ flex: '1 1 auto' }} />

        {hasActiveFilters && (
          <Tooltip title="Clear all filters">
            <Button
              size="small"
              startIcon={<FilterListOffIcon sx={{ fontSize: 14 }} />}
              onClick={handleClearAll}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: theme.palette.text.disabled,
                textTransform: 'none',
                borderRadius: '8px',
                px: 1.5,
                py: '4px',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': { backgroundColor: '#fafafa', color: '#ef4444', borderColor: '#fecaca' },
              }}
            >
              Clear
            </Button>
          </Tooltip>
        )}
      </FilterBar>

      {isError && (
        <Alert severity="error" sx={{ borderRadius: '10px', mb: 2, flexShrink: 0 }}>
          Failed to load segment activity.
        </Alert>
      )}

      {/* ── Table wrapper: fills all remaining vertical space ── */}
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Sticky header */}
        <Box sx={{ flexShrink: 0 }}>
          <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                {BRAND_ACTIVITY_TABLE_HEADERS.map((h, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: theme.palette.text.disabled,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid #f0f0f0',
                      py: 1.5,
                      px: 2,
                      whiteSpace: 'nowrap',
                      width: i === BRAND_ACTIVITY_TABLE_HEADERS.length - 1 ? 56 : 'auto',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </Box>

        {/* Scrollable body — grows to fill remaining space */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#e0e0e0', borderRadius: 3 },
            '&::-webkit-scrollbar-thumb:hover': { background: '#bdbdbd' },
          }}
        >
          <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableBody>
              {isLoading
                ? Array.from({ length: BRAND_ACTIVITY_VISIBLE_ROWS }).map((_, i) => (
                  <TableRow key={i} sx={{ height: BRAND_ACTIVITY_ROW_HEIGHT }}>
                    {BRAND_ACTIVITY_TABLE_HEADERS.map((_, j) => (
                      <TableCell key={j} sx={{ py: 1.5, px: 2 }}>
                        <Skeleton variant="text" width={j === BRAND_ACTIVITY_TABLE_HEADERS.length - 1 ? 28 : '75%'} height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                : rows.map((row, idx) => (
                  <TableRow
                    key={row.first_brand_name ?? idx}
                    sx={{
                      height: BRAND_ACTIVITY_ROW_HEIGHT,
                      '&:hover': { backgroundColor: '#fafafa' },
                      '& td': { borderBottom: '1px solid #f7f7f7' },
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 500, color: theme.palette.text.primary, px: 2, py: 1.5 }}>
                      {row.first_brand_name || '—'}
                    </TableCell>

                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Chip
                        icon={<PeopleAltOutlinedIcon sx={{ fontSize: '13px !important', color: '#fff !important' }} />}
                        label={`${row.session_count?.toLocaleString() ?? 0} sessions`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          background: `linear-gradient(270deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                          color: '#fff',
                          border: 'none',
                          height: 26,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, px: 2, py: 1.5 }}>
                      {row.segment
                        ? <span style={{ fontFamily: 'monospace' }}>{row.segment}</span>
                        : '—'}
                    </TableCell>

                    <TableCell sx={{ px: 2, py: 1.5, width: 56 }}>
                      <Tooltip title={`View sessions for ${row.first_brand_name}`}>
                        <IconButton
                          size="small"
                          onClick={() => openBrandDrawer(row)}
                          sx={{
                            p: '4px',
                            color: theme.palette.primary.main,
                            '&:hover': { backgroundColor: '#f0f7ff' },
                          }}
                        >
                          <OpenInNewIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && !isError && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={BRAND_ACTIVITY_TABLE_HEADERS.length}
                    sx={{ textAlign: 'center', color: theme.palette.text.disabled, fontSize: '0.875rem', border: 'none', py: 6 }}
                  >
                    No active segments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* ── Pagination Footer ── */}
        <Box
          sx={{
            borderTop: '1px solid #f0f0f0',
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.disabled }}>
            {countLoading ? (
              <Skeleton variant="text" width={120} height={14} sx={{ display: 'inline-block' }} />
            ) : (
              <>
                {total > 0 ? (
                  <>
                    Showing{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {startIndex}–{endIndex}
                    </Box>
                    {' '}of{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                      {total.toLocaleString()}
                    </Box>
                    {' '}brand{total !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <Box component="span" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>0</Box>
                    {' '}brands
                  </>
                )}
              </>
            )}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '7px',
                border: `1px solid ${theme.palette.divider}`,
                color: page <= 1 ? theme.palette.grey[300] : theme.palette.text.primary,
                '&:hover:not(:disabled)': { backgroundColor: '#f5f5f5' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) {
                  acc.push('ellipsis');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === 'ellipsis' ? (
                  <Typography key={`ellipsis-${idx}`} sx={{ fontSize: '0.75rem', color: theme.palette.text.disabled, px: 0.5 }}>
                    …
                  </Typography>
                ) : (
                  <IconButton
                    key={item}
                    size="small"
                    onClick={() => setPage(item as number)}
                    disabled={isLoading}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: page === item ? '#bfdbfe' : theme.palette.divider,
                      backgroundColor: page === item ? '#f0f7ff' : 'transparent',
                      color: page === item ? theme.palette.primary.main : theme.palette.text.primary,
                      fontSize: '0.75rem',
                      fontWeight: page === item ? 700 : 400,
                      '&:hover:not(:disabled)': { backgroundColor: page === item ? '#e0f0ff' : '#f5f5f5' },
                    }}
                  >
                    {item}
                  </IconButton>
                )
              )}

            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '7px',
                border: `1px solid ${theme.palette.divider}`,
                color: page >= totalPages ? theme.palette.grey[300] : theme.palette.text.primary,
                '&:hover:not(:disabled)': { backgroundColor: '#f5f5f5' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <BrandSessionsDrawer
        open={brandDrawer.open}
        brand={brandDrawer.brand}
        sinceDate={sinceDate}
        onClose={() => setBrandDrawer({ open: false, brand: '' })}
      />
    </Box>
  );
}
