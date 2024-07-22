import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

import { COLORS } from './constants';

const rootElement = document.getElementById('root');

// All `Portal`-related components need to have the the main app wrapper element as a container
// so that the are in the subtree under the element used in the `important` option of the Tailwind's config.
const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.grass as string,
    },
    secondary: {
      main: COLORS.secondary as string,
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: '0.25rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: COLORS.neutral[300],
          ':hover': {
            borderColor: COLORS.neutral[300],
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderWidth: '0.25rem',
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          padding: 10,
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        selectLabel: {
          fontFamily: 'Inter',
        },
        select: {
          fontFamily: 'Inter',
        },
        menuItem: {
          fontFamily: 'Inter',
        },
        input: {
          fontFamily: 'Inter',
        },
        displayedRows: {
          fontFamily: 'Inter',
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
  },
});

interface Props {
  children: ReactNode;
}

export function MuiTheme({ children }: Props) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MuiTheme;
