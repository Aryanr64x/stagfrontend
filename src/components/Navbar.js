import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Steganography Studio
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Encode
          </Button>
          <Button color="inherit" component={Link} to="/decode">
            Decode
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
