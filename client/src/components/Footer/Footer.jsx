import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();

  return (
    <Box
    component="footer"
    sx={{
      borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      mt: 'auto',
      py: [3, 2],
      backgroundColor:theme.palette.grey[100]
    }}
  >
    <Typography textAlign="center" variant="h6">© 2023 Company, Inc.</Typography>
  </Box>
  )
}

export default Footer