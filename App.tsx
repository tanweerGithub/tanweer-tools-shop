import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ContactPage } from './pages/ContactPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue-600 from tailwind
    },
    secondary: {
      main: '#475569', // Slate-600
    },
    background: {
      default: '#f8fafc', // Slate-50
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ShopProvider>
        <HashRouter>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<OrderSuccessPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
            
            <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '2rem 0', marginTop: 'auto' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
                 <p style={{ marginBottom: '0.5rem' }}>Practice Software Testing - Tanweer's Tool Shop</p>
                 <p style={{ fontSize: '0.875rem' }}>
                   This is a mock e-commerce website for testing purposes. 
                   <br />No real products are sold here.
                 </p>
              </div>
            </footer>
          </div>
        </HashRouter>
      </ShopProvider>
    </ThemeProvider>
  );
};

export default App;