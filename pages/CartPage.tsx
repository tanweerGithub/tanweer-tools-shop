import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { 
  Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Button, TextField, IconButton, Box, Divider 
} from '@mui/material';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');

  const applyCoupon = () => {
    setMessage('');
    if (coupon === 'TEST10') {
      setDiscount(cartTotal * 0.10);
      setMessage('Coupon TEST10 applied! 10% off.');
    } else if (coupon === 'OFF20') {
      setDiscount(cartTotal * 0.20);
      setMessage('Coupon OFF20 applied! 20% off.');
    } else {
      setDiscount(0);
      setMessage('Invalid coupon code.');
    }
  };

  const finalTotal = cartTotal - discount;

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingBag size={80} style={{ color: '#cbd5e1', marginBottom: 24 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">Your cart is empty</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>Looks like you haven't added anything to your cart yet.</Typography>
        <Button variant="contained" component={RouterLink} to="/" size="large">Start Shopping</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom data-test="page-title">
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id} data-test="cart-row">
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Box component="img" src={item.image} alt={item.name} sx={{ width: 64, height: 64, borderRadius: 1, display: { xs: 'none', sm: 'block' } }} />
                         <Typography variant="subtitle1" fontWeight="medium" data-test="product-title">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-test={`decrease-quantity-${item.id}`}
                          sx={{ border: 1, borderColor: 'divider' }}
                        >
                          <Minus size={14} />
                        </IconButton>
                        <Typography 
                          component="span" 
                          sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}
                          data-test="product-quantity"
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-test={`increase-quantity-${item.id}`}
                          sx={{ border: 1, borderColor: 'divider' }}
                        >
                          <Plus size={14} />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right" data-test="product-price">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right" data-test="line-total" sx={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeFromCart(item.id)} color="error" data-test="delete-item">
                        <Trash2 size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={1} sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
            
            <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography data-test="cart-subtotal">${cartTotal.toFixed(2)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                  <Typography>Discount</Typography>
                  <Typography data-test="cart-discount">-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" data-test="cart-total">${finalTotal.toFixed(2)}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>Have a coupon?</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  size="small" 
                  fullWidth 
                  placeholder="Code (e.g. TEST10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  data-test="coupon-code"
                />
                <Button variant="outlined" onClick={applyCoupon} data-test="coupon-apply">Apply</Button>
              </Box>
              {message && (
                <Typography variant="caption" color={discount > 0 ? 'success.main' : 'error.main'} sx={{ mt: 1, display: 'block' }} data-test="coupon-message">
                  {message}
                </Typography>
              )}
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              onClick={() => navigate('/checkout')}
              data-test="checkout"
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};