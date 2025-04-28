import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 8, py: 2, bgcolor: '#f1f1f1', textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Steganography Studio. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
