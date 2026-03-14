import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Skeleton,
  Alert,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useEngagementDepth } from '../../queries/dashboard.queries';
import type { TimePeriod } from '../../types/dashboard.types';

interface EngagementDepthTableProps {
  timePeriod: TimePeriod;
  selectedBrand?: string | null;
  onSelectBrand?: (brand: string | null) => void;
}

type DepthLevel = 'Low' | 'Medium' | 'High' | 'Extreme';

interface DepthInfo {
  label: DepthLevel;
  color: string;
  bg: string;
  order: number;
}

function getDepthInfo(apps: number): DepthInfo {
  if (apps <= 1) return { label: 'Low', color: '#dc2626', bg: 'rgba(220,38,38,0.10)', order: 1 };
  if (apps <= 3) return { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.10)', order: 2 };
  if (apps <= 5) return { label: 'High', color: '#147dc5', bg: 'rgba(20,125,197,0.10)', order: 3 };
  return { label: 'Extreme', color: '#7c3aed', bg: 'rgba(124,58,237,0.10)', order: 4 };
}

type SortColumn = 'merchant' | 'sessions' | 'apps' | 'services' | 'depth';
type SortDirection = 'asc' | 'desc';

const DEPTH_LEVELS: DepthLevel[] = ['Low', 'Medium', 'High', 'Extreme'];

export function EngagementDepthTable({ timePeriod, selectedBrand, onSelectBrand }: EngagementDepthTableProps) {
  const { data, isLoading, isError, refetch } = useEngagementDepth(timePeriod);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [sortColumn, setSortColumn] = useState<SortColumn>('depth');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [depthFilter, setDepthFilter] = useState<string>('');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection(column === 'merchant' ? 'asc' : 'desc');
    }
  };

  const handleRowClick = (brand: string) => {
    if (!onSelectBrand) return;
    onSelectBrand(selectedBrand === brand ? null : brand);
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let rows = data.map(row => ({
      ...row,
      depthInfo: getDepthInfo(row.apps ?? 0),
    }));

    // When a brand is selected, show only that brand's record
    if (selectedBrand) {
      rows = rows.filter(r => {
        const brand = r.Brand || r.facet || '';
        return brand === selectedBrand;
      });
    }

    if (depthFilter) {
      rows = rows.filter(r => r.depthInfo.label === depthFilter);
    }

    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortColumn) {
        case 'merchant':
          cmp = (a.Brand || a.facet || '').localeCompare(b.Brand || b.facet || '');
          break;
        case 'sessions':
          cmp = (a.sessions ?? 0) - (b.sessions ?? 0);
          break;
        case 'apps':
          cmp = (a.apps ?? 0) - (b.apps ?? 0);
          break;
        case 'services':
          cmp = (a.services ?? 0) - (b.services ?? 0);
          break;
        case 'depth':
          cmp = a.depthInfo.order - b.depthInfo.order;
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [data, sortColumn, sortDirection, depthFilter, selectedBrand]);

  const headCellSx = {
    fontWeight: 700,
    fontSize: '0.75rem',
    color: 'text.secondary',
  };

  const depthChipSx = (level: DepthLevel) => {
    const info = getDepthInfo(level === 'Low' ? 1 : level === 'Medium' ? 2 : level === 'High' ? 4 : 6);
    return {
      fontWeight: 700,
      fontSize: '0.65rem',
      color: info.color,
      backgroundColor: info.bg,
      border: `1px solid ${info.color}30`,
      borderRadius: '6px',
      height: 22,
    };
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
          ? 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)'
          : 'linear-gradient(135deg, #161b22 0%, #181d28 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <InsightsIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
            Merchant Engagement Depth
          </Typography>
          {selectedBrand && (
            <Chip
              label={selectedBrand}
              size="small"
              onDelete={() => onSelectBrand?.(null)}
              sx={{
                ml: 1,
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

        {/* Hide depth filter when a brand is selected (only one record visible) */}
        {!selectedBrand && (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel
              id="depth-filter-label"
              sx={{ fontSize: '0.8rem' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FilterListIcon sx={{ fontSize: 14 }} />
                Depth
              </Box>
            </InputLabel>
            <Select
              labelId="depth-filter-label"
              value={depthFilter}
              label="Depth"
              onChange={(e) => setDepthFilter(e.target.value)}
              sx={{
                borderRadius: '8px',
                fontSize: '0.8rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: depthFilter ? '#147dc5' : 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#147dc5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#147dc5',
                },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>All Depths</Typography>
              </MenuItem>
              {DEPTH_LEVELS.map(level => (
                <MenuItem key={level} value={level}>
                  <Chip label={level} size="small" sx={depthChipSx(level)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={40} sx={{ borderRadius: '6px' }} />
          ))}
        </Box>
      ) : isError ? (
        <Alert
          severity="error"
          action={<Button size="small" onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load engagement data
        </Alert>
      ) : !data || data.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No engagement data found for this period.
        </Typography>
      ) : filteredAndSortedData.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          {selectedBrand
            ? `No engagement data found for "${selectedBrand}".`
            : `No merchants found matching "${depthFilter}" depth.`}
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  '& .MuiTableCell-head': {
                    borderBottomColor: 'divider',
                  },
                }}
              >
                <TableCell sx={headCellSx}>
                  <TableSortLabel
                    active={sortColumn === 'merchant'}
                    direction={sortColumn === 'merchant' ? sortDirection : 'asc'}
                    onClick={() => handleSort('merchant')}
                  >
                    Merchant
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <TableSortLabel
                    active={sortColumn === 'sessions'}
                    direction={sortColumn === 'sessions' ? sortDirection : 'desc'}
                    onClick={() => handleSort('sessions')}
                  >
                    Sessions
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <TableSortLabel
                    active={sortColumn === 'apps'}
                    direction={sortColumn === 'apps' ? sortDirection : 'desc'}
                    onClick={() => handleSort('apps')}
                  >
                    Apps Used
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <TableSortLabel
                    active={sortColumn === 'services'}
                    direction={sortColumn === 'services' ? sortDirection : 'desc'}
                    onClick={() => handleSort('services')}
                  >
                    Services Used
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <TableSortLabel
                    active={sortColumn === 'depth'}
                    direction={sortColumn === 'depth' ? sortDirection : 'desc'}
                    onClick={() => handleSort('depth')}
                  >
                    Depth
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedData.map((row, i) => {
                const brand = row.Brand || row.facet || 'Unknown';
                const isSelected = selectedBrand === brand;

                return (
                  <motion.tr
                    key={row.facet || row.Brand || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    style={{
                      display: 'table-row',
                      cursor: onSelectBrand ? 'pointer' : 'default',
                    }}
                    onClick={() => handleRowClick(brand)}
                    whileHover={onSelectBrand ? { backgroundColor: isLight ? 'rgba(20,125,197,0.04)' : 'rgba(20,125,197,0.08)' } : undefined}
                  >
                    <TableCell
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#147dc5' : 'text.primary',
                        borderBottomColor: 'divider',
                        borderLeft: isSelected ? '3px solid #147dc5' : '3px solid transparent',
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)')
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {brand}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '0.8125rem',
                        color: isSelected ? '#147dc5' : 'text.primary',
                        fontWeight: isSelected ? 600 : 400,
                        borderBottomColor: 'divider',
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)')
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {row.sessions ?? 0}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '0.8125rem',
                        color: isSelected ? '#147dc5' : 'text.primary',
                        fontWeight: isSelected ? 600 : 400,
                        borderBottomColor: 'divider',
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)')
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {row.apps ?? 0}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '0.8125rem',
                        color: isSelected ? '#147dc5' : 'text.primary',
                        fontWeight: isSelected ? 600 : 400,
                        borderBottomColor: 'divider',
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)')
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {row.services ?? 0}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: 'divider',
                        backgroundColor: isSelected
                          ? (isLight ? 'rgba(20,125,197,0.06)' : 'rgba(20,125,197,0.12)')
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Chip
                        label={row.depthInfo.label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          letterSpacing: '0.03em',
                          color: row.depthInfo.color,
                          backgroundColor: row.depthInfo.bg,
                          border: `1px solid ${row.depthInfo.color}30`,
                          borderRadius: '6px',
                          minWidth: 72,
                        }}
                      />
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}