
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, TextField, Grid, Checkbox, FormControlLabel, Box } from '@mui/material'

const ProductPricing = ({ productData = {}, updateProductData }) => {
  const [formData, setFormData] = useState({
    price: productData.price || '',
    comparePrice: productData.comparePrice || '',
    costPerItem: productData.costPerItem || '',
    profit: productData.profit || '',
    margin: productData.margin || '',
    chargeTax: productData.chargeTax || false,
    ...productData
  })

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    updateProductData?.(updatedData)
  }

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0
    const cost = parseFloat(formData.costPerItem) || 0
    const profit = price - cost
    const margin = price > 0 ? ((profit / price) * 100).toFixed(2) : 0
    
    handleInputChange('profit', profit.toFixed(2))
    handleInputChange('margin', margin)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Pricing
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={calculateProfit}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Compare-at price"
              type="number"
              value={formData.comparePrice}
              onChange={(e) => handleInputChange('comparePrice', e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.chargeTax}
                  onChange={(e) => handleInputChange('chargeTax', e.target.checked)}
                />
              }
              label="Charge tax on this product"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cost per item"
              type="number"
              value={formData.costPerItem}
              onChange={(e) => handleInputChange('costPerItem', e.target.value)}
              onBlur={calculateProfit}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Profit"
              type="number"
              value={formData.profit}
              InputProps={{
                readOnly: true,
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Margin"
              type="number"
              value={formData.margin}
              InputProps={{
                readOnly: true,
                endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductPricing
