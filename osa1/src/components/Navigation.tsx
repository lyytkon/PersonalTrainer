import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Trainer App
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/customers"
            sx={{ mr: 2 }}
          >
            Asiakkaat
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/trainings"
          >
            Harjoitukset
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
