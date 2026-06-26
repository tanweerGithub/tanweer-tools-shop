import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Check } from 'lucide-react';
import { Container, Grid, Typography, Button, Chip, Box, Paper } from '@mui/material';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, removeFromCart, cart } = useShop();
  const product = products.find(p => p.id === id);
  
  const isAdded = product ? cart.some(item => item.id === product.id) : false;

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>Product not found</Typography>
        <Button component={RouterLink} to="/">Return Home</Button>
      </Container>
    );
  }

  const handleToggleCart = () => {
    if (isAdded) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        component={RouterLink} 
        to="/" 
        startIcon={<ArrowLeft size={16} />} 
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        Back to shop
      </Button>
      
      <Paper elevation={0} variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '500px' }} />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ p: 6 }}>
            <Chip label={product.category} color="primary" variant="outlined" size="small" sx={{ mb: 2 }} />
            
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }} data-test="product-name">
              {product.name}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, fontSize: '1.1rem' }} data-test="product-description">
              {product.description}
            </Typography>
            
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h3" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }} data-test="unit-price">
                ${product.price.toFixed(2)}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Typography variant="body2" color="text.secondary">
                    In Stock: <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>{product.stock}</Box>
                 </Typography>
                 
                 <Button
                  variant="contained"
                  size="large"
                  onClick={handleToggleCart}
                  startIcon={isAdded ? <Check size={20} /> : undefined}
                  color={isAdded ? "success" : "primary"}
                  sx={{ minWidth: 160, py: 1.5 }}
                  data-test="add-to-cart"
                >
                  {isAdded ? 'Added to Cart' : 'Add to Cart'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};