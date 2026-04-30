/**
 * Application-wide constants and configuration values
 */

// Tab navigation labels
export const TAB_LABELS = [
  'Executive Summary',
  'Who Is Active',
  'Segment',
] as const;

// Auto-refresh interval in seconds
export const REFRESH_SECONDS = 30;

// Animation styles
export const LIVE_PULSE_SX = {
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.4 },
  },
  animation: 'pulse 2s ease-in-out infinite',
} as const;

// Table configurations
export const BRAND_SESSIONS_TABLE_COLS = [
  { key: 'session_id',               label: 'Session ID' },
  { key: 'user_name',                label: 'User' },
  { key: 'contact_email',            label: 'Email' },
  { key: 'action',                   label: 'Action' },
  { key: 'login_time',               label: 'Login' },
  { key: 'logout_time',              label: 'Logout' },
  { key: 'session_duration_minutes', label: 'Duration' },
] as const;

export const BRAND_ACTIVITY_TABLE_HEADERS = ['Brand', 'Sessions', 'Segment Code', ''] as const;

export const SESSION_APPS_TABLE_HEADERS = ['App Code'] as const;

// Pagination
export const BRAND_ACTIVITY_PER_PAGE = 20;
export const BRAND_ACTIVITY_ROW_HEIGHT = 44;
export const BRAND_ACTIVITY_VISIBLE_ROWS = 9;
