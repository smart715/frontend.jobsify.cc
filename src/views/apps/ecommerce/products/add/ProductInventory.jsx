
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, TextField, Grid, Checkbox, FormControlLabel, Box } from '@mui/material'

const ProductInventory = ({ productData = {}, updateProductData }) => {
  const [formData, setFormData] = useState({
    trackQuantity: productData.trackQuantity || false,
    quantity: productData.quantity || '',
    shopLocation: productData.shopLocation || '',
    continueSelling: productData.continueSelling || false,
    hasSkuBarcode: productData.hasSkuBarcode || false,
    ...productData
  })

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    updateProductData?.(updatedData)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Inventory
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.trackQuantity}
                  onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                />
              }
              label="Track quantity"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Quantity
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              disabled={!formData.trackQuantity}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Shop location
            </Typography>
            <TextField
              fullWidth
              placeholder="0"
              value={formData.shopLocation}
              onChange={(e) => handleInputChange('shopLocation', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.continueSelling}
                  onChange={(e) => handleInputChange('continueSelling', e.target.checked)}
                />
              }
              label="Continue selling when out of stock"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasSkuBarcode}
                  onChange={(e) => handleInputChange('hasSkuBarcode', e.target.checked)}
                />
              }
              label="This product has a SKU or barcode"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductInventory
