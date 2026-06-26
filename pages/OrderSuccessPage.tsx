import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';

export const OrderSuccessPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 6, width: '100%', textAlign: 'center', borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CheckCircle size={80} color="#22c55e" />
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom data-test="page-title">
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }} data-test="success-message">
          Your order has been successfully placed. <br/>
          Order ID: <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.primary' }}>#{Math.floor(Math.random() * 1000000)}</Box>
        </Typography>
        
        <Button 
          component={RouterLink} 
          to="/" 
          variant="contained" 
          size="large" 
          fullWidth
          data-test="continue-shopping"
        >
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
};