import { Box, Typography } from '@mui/material';

function Home() {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography variant="h1">
        Personal Trainer Sovellus
      </Typography>
      
      <Typography variant="body1" sx={{ mt: 2 }}>
        By Konsta Lyytikäinen
      </Typography>
    </Box>
  );
}

export default Home;
