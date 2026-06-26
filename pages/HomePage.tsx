import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Filter, SlidersHorizontal, Check, Search } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, Grid, Card, CardMedia, CardContent, CardActions, 
  Typography, Button, Box, Paper, Slider, Select, MenuItem, 
  FormControl, InputLabel, Checkbox, FormControlLabel, Divider, TextField, InputAdornment 
} from '@mui/material';

// Sub-component for individual product cards with Add/Remove toggle logic
const ProductItem: React.FC<{ product: Product }> = ({ product }) => {
  const { cart, addToCart, removeFromCart } = useShop();
  
  const isAdded = cart.some(item => item.id === product.id);

  const handleToggleCart = () => {
    if (isAdded) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' } 
        }}
        data-test="product-card"
      >
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ cursor: 'pointer' }}
          onClick={() => window.location.hash = `#/product/${product.id}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <RouterLink to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} data-test={`product-name-${product.id}`}>
            <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
          </RouterLink>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }} data-test="product-price">
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleToggleCart}
            color={isAdded ? "success" : "primary"}
            startIcon={isAdded ? <Check size={16} /> : undefined}
            data-test={`add-to-cart-${product.id}`}
          >
            {isAdded ? "Added to Cart" : "Add to cart"}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export const HomePage: React.FC = () => {
  const { products } = useShop();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('name-asc');
  const [priceRange, setPriceRange] = useState<number>(200);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: string[] = ['All', ...Array.from<string>(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    result = result.filter(p => p.price <= priceRange);

    return result.sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  }, [products, categoryFilter, sortOrder, priceRange, searchQuery]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={1} sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Filter size={20} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Filters</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField 
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
                data-test="search-query"
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOrder}
                  label="Sort By"
                  onChange={(e) => setSortOrder(e.target.value)}
                  data-test="sort"
                >
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="price-asc">Price (Low - High)</MenuItem>
                  <MenuItem value="price-desc">Price (High - Low)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom sx={{ fontWeight: 500 }}>Price Range: ${priceRange}</Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number)}
                min={0}
                max={200}
                valueLabelDisplay="auto"
                data-test="price-slider"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">$0</Typography>
                <Typography variant="caption" color="text.secondary">$200</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box>
              <Typography gutterBottom sx={{ fontWeight: 500 }}>Category</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {categories.map(cat => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox 
                        checked={categoryFilter === cat}
                        onChange={() => setCategoryFilter(cat)}
                        data-test={`category-${cat.toLowerCase().replace(/\s/g, '-')}`}
                      />
                    }
                    label={cat}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }} data-test="page-title">
            Products
          </Typography>
          
          <Grid container spacing={3}>
            {filteredProducts.map(product => (
              <ProductItem 
                key={product.id} 
                product={product} 
              />
            ))}

            {filteredProducts.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <SlidersHorizontal size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                  <Typography variant="h6">No products found matching your filters.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};