'use client';
import React from 'react';
import Image from 'next/image';
import { Grid, Box } from '@mui/material';

export default function AuthLogo() {
  return (
    <Grid
      item
      xs={12}
      sm={12}
      lg={7}
      xl={8}
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          background: '#F2ECF9',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}>
      <Box position="relative">
        <Box px={3}></Box>
        <Box
          alignItems="center"
          justifyContent="center"
          height={'calc(100vh - 75px)'}
          sx={{
            display: {
              xs: 'none',
              lg: 'flex',
            },
          }}>
          <Image
            src={'/images/logos/vtru-login-admin.svg'}
            alt="bg"
            width={500}
            height={500}
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '500px',
            }}
          />
        </Box>
      </Box>
    </Grid>
  );
}
