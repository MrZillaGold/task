import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material';

import { theme } from './components';

import { Main, MainModel, MainModelProvider } from './pages';

import styles from './App.module.css';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          containerRoot: styles.snackbarRoot,
        }}
        dense
      >
        <MainModelProvider value={new MainModel()}>
          <Main />
        </MainModelProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
