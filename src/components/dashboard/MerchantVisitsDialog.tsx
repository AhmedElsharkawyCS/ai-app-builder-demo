import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
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
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import type { PaperProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useMerchantBrandDetails } from '../../queries/dashboard.queries';
import { CountryFlag, getCountryName } from '../common/CountryFlag';
import type { TimePeriod } from '../../types/dashboard.types';

interface MerchantVisitsDialogProps {
  open: boolean;
  onClose: () => void;
  timePeriod: TimePeriod;
}

type SortColumn = 'brand' | 'country' | 'visits' | 'sessions' | 'apps' | 'services';
type SortDirection = 'asc' | 'desc';

function extractBrandAndCountry(row: { facet: string | string[]; Brand?: string; countryCode?: string }) {
  if (Array.isArray(row.facet)) {
    return {
      brand: row.facet[0] || row.Brand || 'Unknown',
      country: row.facet[1] || row.countryCode || '—',
    };
  }
  return {
    brand: row.Brand || row.facet || 'Unknown',
    country: row.countryCode || '—',
  };
}

function DraggablePaper(props: PaperProps) {
  const posRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const paperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-drag-handle]')) {
      e.preventDefault();
      isDragging.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: posRef.current.x,
        posY: posRef.current.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current || !paperRef.current) return;
        const dx = ev.clientX - dragStartRef.current.x;
        const dy = ev.clientY - dragStartRef.current.y;
        posRef.current.x = dragStartRef.current.posX + dx;
        posRef.current.y = dragStartRef.current.posY + dy;
        paperRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, []);

  return (
    <Paper
      {...props}
      ref={paperRef}
      onMouseDown={handleMouseDown}
      style={{
        ...props.style,
        transform: `translate(${posRef.current.x}px, ${posRef.current.y}px)`,
      }}
    />
  );
}

export function MerchantVisitsDialog({ open, onClose, timePeriod }: MerchantVisitsDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isLight = theme.palette.mode === 'light';
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('visits');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data, isLoading, isError, refetch } = useMerchantBrandDetails(timePeriod, open);

  const handleSort = useCallback((column: SortColumn) => {
    setSortDirection((prev) => (sortColumn === column ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortColumn(column);
  }, [sortColumn]);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) => {
        const { brand, country } = extractBrandAndCountry(row);
        const countryName = getCountryName(country);
        return brand.toLowerCase().includes(q) || country.toLowerCase().includes(q) || countryName.toLowerCase().includes(q);
      });
    }

    result.sort((a, b) => {
      const aExtracted = extractBrandAndCountry(a);
      const bExtracted = extractBrandAndCountry(b);
      let aVal: string | number;
      let bVal: string | number;

      switch (sortColumn) {
        case 'brand':
          aVal = aExtracted.brand.toLowerCase();
          bVal = bExtracted.brand.toLowerCase();
          break;
        case 'country':
          aVal = aExtracted.country.toLowerCase();
          bVal = bExtracted.country.toLowerCase();
          break;
        case 'visits':
          aVal = a.count || 0;
          bVal = b.count || 0;
          break;
        case 'sessions':
          aVal = a.sessions || 0;
          bVal = b.sessions || 0;
          break;
        case 'apps':
          aVal = a.apps || 0;
          bVal = b.apps || 0;
          break;
        case 'services':
          aVal = a.services || 0;
          bVal = b.services || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, search, sortColumn, sortDirection]);

  const totalVisits = useMemo(() => {
    if (!data) return 0;
    return data.reduce((sum, d) => sum + (d.count || 0), 0);
  }, [data]);

  const headerCellSx = {
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    color: theme.palette.text.secondary,
    backgroundColor: isDark ? theme.palette.background.paper : '#fafafe',
    borderBottomColor: theme.palette.divider,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperComponent={DraggablePaper}
      PaperProps={{
        sx: {
          width: '85vw',
          height: '85vh',
          maxWidth: '85vw',
          maxHeight: '85vh',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper,
          backgroundImage: isDark
            ? 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(22,27,34,1) 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: theme.palette.divider,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header — draggable handle */}
      <DialogTitle
        data-drag-handle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 0,
          minHeight: 70,
          flexShrink: 0,
          backgroundColor: isLight ? 'rgba(249, 249, 249, 0.8)' : '#1a1a1a',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          transition: 'background-color 0.3s ease',
          cursor: 'grab',
          userSelect: 'none',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <DragIndicatorIcon
          data-drag-handle
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '1.2rem',
            opacity: 0.5,
            mr: -0.5,
          }}
        />
        <Typography
          variant="body2"
          data-drag-handle
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#147dc5',
            whiteSpace: 'nowrap',
            lineHeight: 1.4,
            px: 2.5,
            py: 1,
            borderRadius: '6px',
            backgroundColor: isLight ? '#ffffff' : '#2a2a2a',
            pointerEvents: 'none',
          }}
        >
          Merchant Brand Details
        </Typography>
        <Typography
          variant="caption"
          data-drag-handle
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '0.8rem',
            ml: 0.5,
            pointerEvents: 'none',
          }}
        >
          {data ? `${data.length} brands • ${totalVisits.toLocaleString()} total visits` : 'Loading...'}
        </Typography>
        <Box sx={{ flex: 1 }} data-drag-handle />
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          sx={{
            color: isLight ? '#555' : '#e8eaed',
            '&:hover': {
              backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              color: '#147dc5',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Search Bar */}
        <Box sx={{ px: 3, pt: 2, pb: 1.5, flexShrink: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search brands, countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.875rem',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f4f4f8',
                color: theme.palette.text.primary,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        {isError ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              action={
                <Button size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            >
              Failed to load brand details
            </Alert>
          </Box>
        ) : (
          <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'brand'}
                      direction={sortColumn === 'brand' ? sortDirection : 'asc'}
                      onClick={() => handleSort('brand')}
                    >
                      Brand
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'country'}
                      direction={sortColumn === 'country' ? sortDirection : 'asc'}
                      onClick={() => handleSort('country')}
                    >
                      Country
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'visits'}
                      direction={sortColumn === 'visits' ? sortDirection : 'desc'}
                      onClick={() => handleSort('visits')}
                    >
                      Visits
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'sessions'}
                      direction={sortColumn === 'sessions' ? sortDirection : 'desc'}
                      onClick={() => handleSort('sessions')}
                    >
                      Sessions
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'apps'}
                      direction={sortColumn === 'apps' ? sortDirection : 'desc'}
                      onClick={() => handleSort('apps')}
                    >
                      Apps
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sx={headerCellSx}>
                    <TableSortLabel
                      active={sortColumn === 'services'}
                      direction={sortColumn === 'services' ? sortDirection : 'desc'}
                      onClick={() => handleSort('services')}
                    >
                      Services
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="text" width={160} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={60} height={22} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={50} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={50} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: theme.palette.text.secondary }}>
                      <StorefrontIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                      <Typography variant="body2">No brands found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredAndSortedData.map((row, i) => {
                      const { brand: brandName, country } = extractBrandAndCountry(row);
                      const initial = brandName.charAt(0).toUpperCase();
                      const hue = (i * 37) % 360;
                      return (
                        <motion.tr
                          key={`${brandName}-${country}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.5) }}
                          style={{ display: 'table-row' }}
                        >
                          <TableCell sx={{ borderBottomColor: theme.palette.divider }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  background: `hsl(${hue}, 55%, ${isDark ? '40%' : '50%'})`,
                                  color: '#fff',
                                }}
                              >
                                {initial}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: theme.palette.text.primary }}>
                                {brandName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottomColor: theme.palette.divider }}>
                            <Chip
                              icon={
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                                  <CountryFlag code={country} size={14} showTooltip={false} borderRadius="2px" />
                                </Box>
                              }
                              label={`${getCountryName(country)} (${country})`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                                color: theme.palette.text.primary,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                '& .MuiChip-icon': {
                                  marginRight: '-2px',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottomColor: theme.palette.divider }}>
                            <Chip
                              label={row.count?.toLocaleString() ?? '—'}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                background: isDark ? '#2d1b69' : '#ede9fe',
                                color: isDark ? '#c4b5fd' : '#5b21b6',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottomColor: theme.palette.divider }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                              {row.sessions?.toLocaleString() ?? '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottomColor: theme.palette.divider }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                              {row.apps?.toLocaleString() ?? '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottomColor: theme.palette.divider }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                              {row.services?.toLocaleString() ?? '—'}
                            </Typography>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}