
'use client'

import { useState, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Paper } from '@mui/material'
import { ShoppingCart, TrendingUp, People, Storage, Add, Visibility, Edit, Delete } from '@mui/icons-material'

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {change && (
            <Typography variant="body2" color={change > 0 ? 'success.main' : 'error.main'}>
              {change > 0 ? '+' : ''}{change}% from last month
            </Typography>
          )}
        </Box>
        <Box 
          sx={{ 
            backgroundColor: `${color}.light`, 
            borderRadius: 1, 
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ color: `${color}.main`, fontSize: 24 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const EcommerceDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch products count
        const productsRes = await fetch('/api/ecommerce/products?limit=1')
        const productsData = await productsRes.json()
        
        // Fetch orders count and recent orders
        const ordersRes = await fetch('/api/ecommerce/orders?limit=5')
        const ordersData = await ordersRes.json()
        
        // Fetch customers count
        const customersRes = await fetch('/api/ecommerce/customers?limit=1')
        const customersData = await customersRes.json()
        
        // Fetch recent products
        const recentProductsRes = await fetch('/api/ecommerce/products?limit=5')
        const recentProductsData = await recentProductsRes.json()

        // Calculate total revenue from orders
        const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0

        setStats({
          totalProducts: productsData.pagination?.total || 0,
          totalOrders: ordersData.pagination?.total || 0,
          totalCustomers: customersData.pagination?.total || 0,
          totalRevenue
        })

        setRecentOrders(ordersData.orders || [])
        setRecentProducts(recentProductsData.products || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success'
      case 'PENDING': return 'warning'
      case 'CANCELLED': return 'error'
      case 'DELIVERED': return 'info'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          E-commerce Dashboard
        </Typography>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          E-commerce Dashboard
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            sx={{ mr: 1 }}
            href="/ecommerce/products/add"
          >
            Add Product
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            href="/ecommerce/categories/add"
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Storage}
            color="primary"
            change={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="success"
            change={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={People}
            color="info"
            change={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={TrendingUp}
            color="warning"
            change={23}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Orders
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<Visibility />}
                  href="/ecommerce/orders/list"
                >
                  View All
                </Button>
              </Box>
              
              {recentOrders.length === 0 ? (
                <Typography color="textSecondary" textAlign="center" py={3}>
                  No orders found. Create your first order!
                </Typography>
              ) : (
                <List>
                  {recentOrders.map((order) => (
                    <ListItem
                      key={order.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        '&:last-child': { mb: 0 }
                      }}
                      secondaryAction={
                        <Box>
                          <Chip 
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="h6" component="span">
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ShoppingCart />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Order #${order.orderNumber}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {order.customer ? 
                                `${order.customer.firstName} ${order.customer.lastName}` : 
                                'Guest Customer'
                              }
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Products */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Products
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<Visibility />}
                  href="/ecommerce/products/list"
                >
                  View All
                </Button>
              </Box>
              
              {recentProducts.length === 0 ? (
                <Typography color="textSecondary" textAlign="center" py={3}>
                  No products found. Add your first product!
                </Typography>
              ) : (
                <List>
                  {recentProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        '&:last-child': { mb: 0 }
                      }}
                      secondaryAction={
                        <Box>
                          <IconButton size="small" sx={{ mr: 0.5 }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={product.images?.[0]?.url}
                          sx={{ bgcolor: 'secondary.main' }}
                        >
                          {product.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary">
                              ${product.price?.toFixed(2) || '0.00'}
                            </Typography>
                            <Chip 
                              label={product.status}
                              size="small"
                              color={product.status === 'ACTIVE' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Add />}
                  href="/ecommerce/products/add"
                >
                  Add Product
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Add />}
                  href="/ecommerce/categories/add"
                >
                  Add Category
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Visibility />}
                  href="/ecommerce/orders/list"
                >
                  View Orders
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Visibility />}
                  href="/ecommerce/customers/list"
                >
                  View Customers
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EcommerceDashboard
