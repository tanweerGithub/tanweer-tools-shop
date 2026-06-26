import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Container, Box } from '@mui/material';
import { ShoppingCart, User, LogOut, Home } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const { cart, user, logout } = useShop();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'slate.900' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
             <Home size={24} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            data-test="nav-home"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            Tanweer's Tool Shop
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <Button component={RouterLink} to="/" color="inherit" data-test="nav-home-menu">Home</Button>
            <Button component={RouterLink} to="/contact" color="inherit" data-test="nav-contact">Contact</Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }} data-test="nav-user-name">
                  Hi, {user.firstName}
                </Typography>
                <Button 
                  onClick={handleLogout}
                  color="inherit"
                  startIcon={<LogOut size={18} />}
                  data-test="nav-sign-out"
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  color="inherit" 
                  startIcon={<User size={18} />}
                  data-test="nav-sign-in"
                >
                  Sign In
                </Button>
              </Box>
            )}

            <IconButton 
              component={RouterLink} 
              to="/cart" 
              color="inherit" 
              data-test="nav-cart"
            >
              <Badge badgeContent={cartItemCount} color="error" data-test="cart-quantity">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};