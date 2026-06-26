import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { PaymentMethod } from '../types';
import { ArrowLeft } from 'lucide-react';
import { Container, Grid, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert, Link } from '@mui/material';

export const CheckoutPage: React.FC = () => {
  const { cartTotal, user, clearCart } = useShop();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BankTransfer);
  
  if (cartTotal === 0) {
     navigate('/cart');
     return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
        clearCart();
        navigate('/success');
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
           <Button 
             component={RouterLink} 
             to="/cart" 
             startIcon={<ArrowLeft size={20} />}
             color="inherit"
             data-test="back-to-cart"
           >
             Back to Cart
           </Button>
        </Box>

        <Typography variant="h3" fontWeight="bold" align="center" gutterBottom data-test="page-title">
            Checkout
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Billing Address Mock */}
            <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Shipping Address</Typography>
                    {user ? (
                       <Box sx={{ color: 'text.secondary', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                           <Typography color="text.primary" fontWeight="medium">{user.firstName} {user.lastName}</Typography>
                           <Typography>123 Test Street</Typography>
                           <Typography>Test City, TS 12345</Typography>
                           <Typography>United States</Typography>
                           <Alert severity="warning" sx={{ mt: 2 }}>
                              Note: Address is pre-filled for demo purposes.
                           </Alert>
                       </Box>
                    ) : (
                        <Alert severity="error">
                            You are checking out as a Guest. <Link component={RouterLink} to="/login" fontWeight="bold">Login</Link> to save your details.
                        </Alert>
                    )}
                </Paper>
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Payment</Typography>
                    <form onSubmit={handlePlaceOrder}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select 
                                value={paymentMethod}
                                label="Payment Method"
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                data-test="payment-method"
                            >
                                <MenuItem value={PaymentMethod.BankTransfer}>Bank Transfer</MenuItem>
                                <MenuItem value={PaymentMethod.CreditCard}>Credit Card</MenuItem>
                                <MenuItem value={PaymentMethod.GiftCard}>Gift Card</MenuItem>
                            </Select>
                        </FormControl>

                        {paymentMethod === PaymentMethod.CreditCard && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField fullWidth label="Card Number" placeholder="0000 0000 0000 0000" required />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField fullWidth label="Expiry" placeholder="MM/YY" required />
                                    <TextField fullWidth label="CVV" placeholder="123" required />
                                </Box>
                            </Box>
                        )}

                        {paymentMethod === PaymentMethod.BankTransfer && (
                             <Alert severity="info" sx={{ mb: 2 }}>
                                 <Typography variant="body2">Bank: Test Bank</Typography>
                                 <Typography variant="body2">Account: 123456789</Typography>
                             </Alert>
                        )}
                        
                        {paymentMethod === PaymentMethod.GiftCard && (
                             <TextField 
                                fullWidth 
                                label="Gift Card Number" 
                                required 
                                data-test="gift-card-number" 
                             />
                        )}

                        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mt: 3 }}>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                 <Typography variant="subtitle1">Total to Pay:</Typography>
                                 <Typography variant="h4" fontWeight="bold" data-test="total">${cartTotal.toFixed(2)}</Typography>
                             </Box>
                             <Button 
                                type="submit" 
                                variant="contained" 
                                color="success" 
                                fullWidth 
                                size="large"
                                data-test="finish"
                            >
                                 Place Order
                             </Button>
                        </Box>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    </Container>
  );
};