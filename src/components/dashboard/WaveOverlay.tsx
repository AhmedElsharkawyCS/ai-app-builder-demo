import React from 'react';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface WaveOverlayProps {
  color?: string;
  opacity?: number;
  height?: number;
}

export function WaveOverlay({ color = '#147dc5', opacity = 0.06, height = 60 }: WaveOverlayProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    >
      <motion.svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          width: '200%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
        animate={{ x: [0, -600] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 8,
            ease: 'linear',
          },
        }}
      >
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z"
          fill={color}
          opacity={opacity}
        />
        <path
          d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
          fill={color}
          opacity={opacity * 0.7}
        />
      </motion.svg>
      <motion.svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          width: '200%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
        animate={{ x: [-300, -900] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 6,
            ease: 'linear',
          },
        }}
      >
        <path
          d="M0,50 C180,90 380,10 600,50 C820,90 1020,10 1200,50 L1200,120 L0,120 Z"
          fill={color}
          opacity={opacity * 0.5}
        />
      </motion.svg>
    </Box>
  );
}