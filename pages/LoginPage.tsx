import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { DEMO_CREDENTIALS } from '../constants';
import { Container, Paper, Typography, TextField, Button, Alert, Box, Link } from '@mui/material';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useShop();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (email === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      login({
        email: email,
        firstName: 'Tanweer',
        lastName: 'User'
      });
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom data-test="login-title">
            Sign in
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>For testing use:</Typography>
          <Typography variant="body2">Email: <code>{DEMO_CREDENTIALS.username}</code></Typography>
          <Typography variant="body2">Password: <code>{DEMO_CREDENTIALS.password}</code></Typography>
        </Alert>

        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-test="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-test="password"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} data-test="login-error">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            data-test="login-submit"
          >
            Sign in
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" data-test="register-link">
                Register your account
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};