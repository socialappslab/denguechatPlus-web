import { Box, CircularProgress, Container } from '@mui/material';

export function Progress() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
      <CircularProgress className="text-grass" />
    </Box>
  );
}

export function Loader({ height = '95vh' }: { height?: string }) {
  return (
    <Container sx={{ height }}>
      <Progress />
    </Container>
  );
}

export default Loader;
