import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DevicesIcon from '@mui/icons-material/Devices';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AppsIcon from '@mui/icons-material/Apps';

import { ApplicationCode } from '../types/applicationCodes';

export interface AppMetadata {
  icon: React.ReactNode;
  color: string;
  displayName: string;
}

/**
 * Mapping of known application codes to their UI metadata
 */
const APP_METADATA_MAP: Record<string, AppMetadata> = {
  [ApplicationCode.ACCOUNT]: {
    icon: React.createElement(AccountCircleIcon),
    color: '#3b82f6',
    displayName: 'Account',
  },
  [ApplicationCode.BILLING]: {
    icon: React.createElement(ReceiptIcon),
    color: '#059669',
    displayName: 'Billing',
  },
  [ApplicationCode.WALLET]: {
    icon: React.createElement(AccountBalanceWalletIcon),
    color: '#7c3aed',
    displayName: 'Wallet',
  },
  [ApplicationCode.AUTHENTICATION]: {
    icon: React.createElement(LockIcon),
    color: '#ea580c',
    displayName: 'Authentication',
  },
  [ApplicationCode.SLA_PROCESS]: {
    icon: React.createElement(AccessTimeIcon),
    color: '#10b981',
    displayName: 'SLA Process',
  },
  [ApplicationCode.TERMINALS]: {
    icon: React.createElement(DevicesIcon),
    color: '#f59e0b',
    displayName: 'Terminals',
  },
  [ApplicationCode.REPORTS]: {
    icon: React.createElement(AssessmentIcon),
    color: '#dc2626',
    displayName: 'Reports',
  },
  [ApplicationCode.PAYOUT]: {
    icon: React.createElement(PaymentIcon),
    color: '#06b6d4',
    displayName: 'Payout',
  },
  [ApplicationCode.ACCEPTANCE]: {
    icon: React.createElement(CheckCircleIcon),
    color: '#8b5cf6',
    displayName: 'Acceptance',
  },
  [ApplicationCode.BUSINESS]: {
    icon: React.createElement(BusinessIcon),
    color: '#d946ef',
    displayName: 'Business',
  },
  [ApplicationCode.LEAD]: {
    icon: React.createElement(PersonAddIcon),
    color: '#84cc16',
    displayName: 'Lead',
  },
};

/**
 * Generate a color from a string using a simple hash function
 */
function hashStringToColor(str: string): string {
  const colors = [
    '#3b82f6', '#059669', '#7c3aed', '#ea580c', '#10b981', '#f59e0b',
    '#dc2626', '#06b6d4', '#8b5cf6', '#d946ef', '#84cc16', '#14b8a6',
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Format application code for display
 * Example: "BILLING" → "Billing", "SLA_PROCESS" → "SLA Process"
 */
function formatAppName(appCode: string): string {
  return appCode
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get metadata (icon, color, displayName) for an application
 * Returns predefined metadata for known apps, or generates fallback for unknown apps
 */
export function getAppMetadata(appCode: string): AppMetadata {
  // Check if app is in the known mapping
  if (APP_METADATA_MAP[appCode]) {
    return APP_METADATA_MAP[appCode];
  }

  // Fallback for unknown apps
  return {
    icon: React.createElement(AppsIcon),
    color: hashStringToColor(appCode),
    displayName: formatAppName(appCode),
  };
}
