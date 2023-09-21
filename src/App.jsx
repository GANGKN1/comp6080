import React from 'react';
import { SnackbarProvider } from 'notistack';
import Wrapper from './Wrapper';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
  },
});

if (process.env.NODE_ENV === 'development') {
  const handleError = (error, info) => {
    console.error('Error:', error);
    console.error('Info:', info);
  };

  const oldConsoleError = console.error;
  console.error = (...args) => {
    if (
      args[0].includes('ResizeObserver loop limit exceeded') ||
      args[0].includes('ResizeObserver loop completed with undelivered notifications.')
    ) {
      handleError(...args);
      return;
    }
    oldConsoleError.apply(console, args);
  };
}

function App () {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        {/* Your app components */}
        <Wrapper />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
