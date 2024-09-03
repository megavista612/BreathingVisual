import React from 'react';
import BoxBreathing from './components/BoxBreathing';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, Tooltip } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    background: {
      default: '#f0f0f0',
    },
  },
});

const fullDescription = `
  Box breathing is a simple relaxation technique that can help reduce stress and improve focus. 
  This rhythmic breathing pattern promotes calmness and mental clarity.
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Box Breathing Visualization
          </Typography>
          <Tooltip title={fullDescription} arrow placement="bottom">
            <Typography variant="body1" sx={{ mb: 4, cursor: 'help' }}>
              Exhale, hold, inhale, and hold again, each for 4 seconds
            </Typography>
          </Tooltip>
          <BoxBreathing />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;