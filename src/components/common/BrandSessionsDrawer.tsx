import React, { useState } from 'react';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Tooltip,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useSessionBrandDrillDown } from '../../queries/brand-activity.queries';
import { SessionAppsDrawer } from './SessionAppsDrawer';
import { formatTimestamp, resolveDuration, type DurationResult } from '../../utils/formatters';
import { BRAND_SESSIONS_TABLE_COLS } from '../../utils/constants';

interface BrandSessionsDrawerProps {
  open: boolean;
  brand: string;
  sinceDate?: string;
  onClose: () => void;
}

export function BrandSessionsDrawer({ open, brand, sinceDate, onClose }: BrandSessionsDrawerProps) {
  const theme = useTheme();
  const { data, isLoading, isError } = useSessionBrandDrillDown(
    open ? brand : undefined,
    sinceDate
  );

  const [sessionDrawer, setSessionDrawer] = useState<{ open: boolean; sessionId: string }>({
    open: false,
    sessionId: '',
  });

  const rows = data ?? [];

  const openSessionDrawer = (sessionId: string) => {
    setSessionDrawer({ open: true, sessionId });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 760, md: 900 },
            backgroundColor: '#ffffff',
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid #f0f0f0',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  backgroundColor: '#f0f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StorefrontIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: theme.palette.text.primary }}>
                  Brand Sessions
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: theme.palette.text.disabled,
                    mt: 0.25,
                    maxWidth: 340,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={brand}
                >
                  {brand}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: theme.palette.text.disabled }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Context chips */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderBottom: '1px solid #f0f0f0',
              flexShrink: 0,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Chip
              icon={<StorefrontIcon sx={{ fontSize: '12px !important' }} />}
              label={brand}
              size="small"
              sx={{
                fontSize: '0.75rem',
                backgroundColor: '#f0f7ff',
                color: theme.palette.primary.main,
                border: '1px solid #b4d9eb',
                maxWidth: 260,
                '& .MuiChip-label': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
            />
            {!isLoading && (
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.disabled, ml: 'auto' }}>
                <Box component="span" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{rows.length}</Box>
                {' '}session{rows.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          {/* Body */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {isError && (
              <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ borderRadius: '10px' }}>
                  Failed to load brand session data.
                </Alert>
              </Box>
            )}

            {!isError && (
              <TableContainer sx={{ px: 0 }}>
                <Table size="small" sx={{ minWidth: 620 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      {BRAND_SESSIONS_TABLE_COLS.map((col) => (
                        <TableCell
                          key={col.key}
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
                          }}
                        >
                          {col.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <TableRow key={i}>
                            {BRAND_SESSIONS_TABLE_COLS.map((col) => (
                              <TableCell key={col.key} sx={{ py: 1.5, px: 2 }}>
                                <Skeleton variant="text" width="75%" height={14} />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      : rows.map((row, i) => {
                          const duration = resolveDuration(
                            row.login_time,
                            row.logout_time,
                            row.session_duration_minutes
                          );
                          return (
                            <TableRow
                              key={i}
                              sx={{
                                '&:hover': { backgroundColor: '#fafafa' },
                                '& td': { borderBottom: '1px solid #f7f7f7' },
                              }}
                            >
                              {/* Session ID with Info Icon */}
                              <TableCell sx={{ px: 2, py: 1.5, maxWidth: 200 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                  <Tooltip title="View session info">
                                    <IconButton
                                      size="small"
                                      onClick={() => openSessionDrawer(row.session_id || '')}
                                      sx={{
                                        p: '4px',
                                        color: theme.palette.text.disabled,
                                        '&:hover': { backgroundColor: '#f0f7ff', color: theme.palette.primary.main },
                                      }}
                                    >
                                      <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={row.session_id || ''} placement="top">
                                    <Typography
                                      sx={{
                                        fontSize: '0.75rem',
                                        fontFamily: 'Geist Mono, monospace',
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        letterSpacing: '0.01em',
                                        flex: 1,
                                        minWidth: 0,
                                      }}
                                    >
                                      {row.session_id || '—'}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              </TableCell>

                              {/* User */}
                              <TableCell
                                sx={{
                                  fontSize: '0.8125rem',
                                  color: theme.palette.text.primary,
                                  px: 2,
                                  py: 1.5,
                                  whiteSpace: 'nowrap',
                                  maxWidth: 140,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {row.user_name || '—'}
                              </TableCell>

                              {/* Email */}
                              <TableCell
                                sx={{
                                  fontSize: '0.75rem',
                                  color: theme.palette.text.secondary,
                                  px: 2,
                                  py: 1.5,
                                  whiteSpace: 'nowrap',
                                  maxWidth: 180,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {row.contact_email || '—'}
                              </TableCell>

                              {/* Action */}
                              <TableCell sx={{ px: 2, py: 1.5 }}>
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: 1,
                                    py: '2px',
                                    borderRadius: '6px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    textTransform: 'lowercase',
                                    backgroundColor:
                                      row.action === 'login'
                                        ? '#f0fdf4'
                                        : row.action === 'logout'
                                        ? '#fff7ed'
                                        : '#f3f4f6',
                                    color:
                                      row.action === 'login'
                                        ? '#15803d'
                                        : row.action === 'logout'
                                        ? '#c2410c'
                                        : theme.palette.text.secondary,
                                    border:
                                      row.action === 'login'
                                        ? '1px solid #bbf7d0'
                                        : row.action === 'logout'
                                        ? '1px solid #fed7aa'
                                        : '1px solid #e5e7eb',
                                  }}
                                >
                                  {row.action || '—'}
                                </Box>
                              </TableCell>

                              {/* Login Time */}
                              <TableCell sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, px: 2, py: 1.5, whiteSpace: 'nowrap' }}>
                                {formatTimestamp(row.login_time)}
                              </TableCell>

                              {/* Logout Time */}
                              <TableCell sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, px: 2, py: 1.5, whiteSpace: 'nowrap' }}>
                                {formatTimestamp(row.logout_time)}
                              </TableCell>

                              {/* Duration */}
                              <TableCell sx={{ px: 2, py: 1.5, whiteSpace: 'nowrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                  {duration.isLive && (
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: '#059669',
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  <Typography
                                    sx={{
                                      fontSize: '0.8125rem',
                                      fontWeight: 500,
                                      color: duration.isLive ? '#059669' : theme.palette.text.primary,
                                    }}
                                  >
                                    {duration.display}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}

                    {!isLoading && rows.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={BRAND_SESSIONS_TABLE_COLS.length}
                          sx={{ textAlign: 'center', py: 6, color: theme.palette.text.disabled, fontSize: '0.875rem' }}
                        >
                          No sessions found for this brand
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Drawer>

      <SessionAppsDrawer
        open={sessionDrawer.open}
        sessionId={sessionDrawer.sessionId}
        onClose={() => setSessionDrawer({ open: false, sessionId: '' })}
      />
    </>
  );
}
