
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'iPhone 13 Pro',
        sku: 'IP13P-128',
        price: 999,
        stock: 45,
        status: 'In Stock',
        category: 'Electronics',
        image: '/images/apps/ecommerce/product-1.png'
      },
      {
        id: 2,
        name: 'MacBook Air M2',
        sku: 'MBA-M2-256',
        price: 1299,
        stock: 12,
        status: 'Low Stock',
        category: 'Computers',
        image: '/images/apps/ecommerce/product-2.png'
      },
      {
        id: 3,
        name: 'AirPods Pro',
        sku: 'APP-GEN2',
        price: 249,
        stock: 0,
        status: 'Out of Stock',
        category: 'Audio',
        image: '/images/apps/ecommerce/product-3.png'
      }
    ]
    setProducts(mockProducts)
  }, [])

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success'
      case 'Low Stock':
        return 'warning'
      case 'Out of Stock':
        return 'error'
      default:
        return 'default'
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Products"
            action={
              <Button
                variant="contained"
                startIcon={<i className="ri-add-line" />}
                href="/apps/ecommerce/products/add"
              >
                Add Product
              </Button>
            }
          />
          <CardContent>
            {/* Search and Filters */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="ri-search-line" />
                    </InputAdornment>
                  )
                }}
                sx={{ maxWidth: 400 }}
              />
            </Box>

            {/* Products Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={product.image}
                            alt={product.name}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          ${product.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.stock}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          color={getStatusColor(product.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {product.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, product)}
                        >
                          <i className="ri-more-2-line" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredProducts.length === 0 && (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <i className="ri-eye-line" style={{ marginRight: 8 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <i className="ri-edit-box-line" style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <i className="ri-delete-bin-7-line" style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </Grid>
  )
}

export default ProductList
