import React from 'react';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AppsIcon from '@mui/icons-material/Apps';

import { useUniqueAppsOpened } from '../../queries/brand-activity.queries';
import { SESSION_APPS_TABLE_HEADERS } from '../../utils/constants';

interface SessionAppsDrawerProps {
  open: boolean;
  sessionId: string;
  onClose: () => void;
}

export function SessionAppsDrawer({ open, sessionId, onClose }: SessionAppsDrawerProps) {
  const theme = useTheme();
  const { data, isLoading, isError } = useUniqueAppsOpened(open ? sessionId : undefined);

  const rows = data ?? [];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480, md: 560 },
          backgroundColor: '#ffffff',
          borderRight: `1px solid ${theme.palette.divider}`,
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
              <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: theme.palette.text.primary }}>
                Session Apps
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: theme.palette.text.disabled,
                  mt: 0.25,
                  fontFamily: 'Geist Mono, monospace',
                  maxWidth: 280,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={sessionId}
              >
                {sessionId}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: theme.palette.text.disabled }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {isError && (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              Failed to load unique apps for this session.
            </Alert>
          )}

          {!isError && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AppsIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: theme.palette.text.primary }}>
                  Unique Apps Opened
                </Typography>
                {!isLoading && (
                  <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.disabled, ml: 'auto' }}>
                    <Box component="span" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{rows.length}</Box>
                    {' '}app{rows.length !== 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      {SESSION_APPS_TABLE_HEADERS.map((h, i) => (
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
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ py: 1.5, px: 2 }}>
                              <Skeleton variant="text" width="65%" height={14} />
                            </TableCell>
                          </TableRow>
                        ))
                      : rows.map((row, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              '&:hover': { backgroundColor: '#fafafa' },
                              '& td': { borderBottom: idx === rows.length - 1 ? 'none' : '1px solid #f7f7f7' },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: '0.8125rem',
                                color: theme.palette.text.primary,
                                fontWeight: 500,
                                px: 2,
                                py: 1.5,
                                fontFamily: 'Geist Mono, monospace',
                              }}
                            >
                              {row.appCode}
                            </TableCell>
                          </TableRow>
                        ))}

                    {!isLoading && rows.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={SESSION_APPS_TABLE_HEADERS.length}
                          sx={{ textAlign: 'center', py: 6, color: theme.palette.text.disabled, fontSize: '0.875rem' }}
                        >
                          No apps opened in this session
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
