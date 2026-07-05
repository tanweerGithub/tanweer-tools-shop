import React from 'react';
import { useShop } from '../context/ShopContext';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { ShoppingBag } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders } = useShop();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom data-test="page-title">
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            mt: 4
          }} 
          elevation={0}
        >
          <ShoppingBag size={64} strokeWidth={1} />
          <Typography variant="h6">You haven't placed any orders yet.</Typography>
          <Typography color="text.secondary">Your past orders will appear here.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Items</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} data-test="order-row">
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" data-test="order-id">
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{order.items.length}</TableCell>
                  <TableCell align="right" data-test="order-total">
                    ${order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};