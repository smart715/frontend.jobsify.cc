
'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'

const ProductOrganize = ({ productData, updateProductData }) => {
  const handleStatusChange = (e) => {
    updateProductData('status', e.target.value)
  }

  const handleVendorChange = (e) => {
    updateProductData('vendor', e.target.value)
  }

  const handleTypeChange = (e) => {
    updateProductData('productType', e.target.value)
  }

  const handleTagsChange = (e) => {
    updateProductData('tags', e.target.value.split(',').map(tag => tag.trim()))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Status Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Status
          </Typography>
          <FormControl fullWidth>
            <Select
              value={productData.status || 'Active'}
              onChange={handleStatusChange}
              displayEmpty
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Publishing Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Publishing
            </Typography>
            <Button variant="text" size="small">
              Manage
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Online Store" 
              variant="outlined" 
              size="small"
              icon={<span style={{ fontSize: '12px' }}>🌐</span>}
            />
            <Chip 
              label="Point of Sale" 
              variant="outlined" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Product Organization Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="h6">
              Product organization
            </Typography>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Type
            </Typography>
            <TextField
              fullWidth
              placeholder=""
              value={productData.productType || ''}
              onChange={handleTypeChange}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Vendor
            </Typography>
            <TextField
              fullWidth
              placeholder=""
              value={productData.vendor || ''}
              onChange={handleVendorChange}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Category
            </Typography>
            <TextField
              fullWidth
              placeholder=""
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <TextField
              fullWidth
              placeholder=""
              value={productData.tags?.join(', ') || ''}
              onChange={handleTagsChange}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Theme Template Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Theme template
          </Typography>
          <FormControl fullWidth>
            <Select
              displayEmpty
              defaultValue=""
            >
              <MenuItem value="">Select template</MenuItem>
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="modern">Modern</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProductOrganize
