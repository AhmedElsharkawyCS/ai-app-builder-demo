import React from 'react';

import { Box, Tooltip } from '@mui/material';

const COUNTRY_NAMES: Record<string, string> = {
  SA: 'Saudi Arabia',
  AE: 'UAE',
  KW: 'Kuwait',
  BH: 'Bahrain',
  QA: 'Qatar',
  OM: 'Oman',
  EG: 'Egypt',
  JO: 'Jordan',
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
  PK: 'Pakistan',
  TR: 'Turkey',
  DE: 'Germany',
  FR: 'France',
  LB: 'Lebanon',
  IQ: 'Iraq',
  YE: 'Yemen',
  SD: 'Sudan',
  LY: 'Libya',
  TN: 'Tunisia',
  MA: 'Morocco',
  DZ: 'Algeria',
  SY: 'Syria',
  PS: 'Palestine',
  CN: 'China',
  JP: 'Japan',
  KR: 'South Korea',
  BR: 'Brazil',
  CA: 'Canada',
  AU: 'Australia',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  CH: 'Switzerland',
  AT: 'Austria',
  PL: 'Poland',
  RU: 'Russia',
  MX: 'Mexico',
  SG: 'Singapore',
  MY: 'Malaysia',
  TH: 'Thailand',
  ID: 'Indonesia',
  PH: 'Philippines',
  VN: 'Vietnam',
  BD: 'Bangladesh',
  LK: 'Sri Lanka',
  NP: 'Nepal',
  ZA: 'South Africa',
  NG: 'Nigeria',
  KE: 'Kenya',
  GH: 'Ghana',
};

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code?.toUpperCase()] || code;
}

export function getFlagUrl(code: string): string {
  const upper = code?.toUpperCase() || '';
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${upper}.svg`;
}

interface CountryFlagProps {
  code: string;
  size?: number;
  showTooltip?: boolean;
  borderRadius?: string;
}

export function CountryFlag({ code, size = 20, showTooltip = true, borderRadius = '3px' }: CountryFlagProps) {
  if (!code || code === '—') {
    return null;
  }

  const upperCode = code.toUpperCase();
  const name = getCountryName(upperCode);

  const flagImg = (
    <Box
      component="img"
      src={getFlagUrl(upperCode)}
      alt={`${name} flag`}
      sx={{
        width: size * 1.5,
        height: size,
        objectFit: 'cover',
        borderRadius,
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.1)',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        target.style.display = 'none';
      }}
    />
  );

  if (showTooltip) {
    return (
      <Tooltip title={`${name} (${upperCode})`} arrow placement="top">
        {flagImg}
      </Tooltip>
    );
  }

  return flagImg;
}