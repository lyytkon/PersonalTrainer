import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Personal Trainer Sovellus
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ mr: 2 }}
          >
            Etusivu
          </Button>
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
            sx={{ mr: 2 }}
          >
            Harjoitukset
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/calendar"
          >
            Kalenteri
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
