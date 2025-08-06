
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, TextField, Grid, Checkbox, FormControlLabel, Box, MenuItem, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

const ProductShipping = ({ productData = {}, updateProductData }) => {
  const [formData, setFormData] = useState({
    isPhysicalProduct: productData.isPhysicalProduct || false,
    weight: productData.weight || '',
    weightUnit: productData.weightUnit || 'kg',
    customsInformation: productData.customsInformation || '',
    ...productData
  })

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    updateProductData?.(updatedData)
  }

  const handleAddCustomsInfo = () => {
    console.log('Add customs information')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Shipping
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPhysicalProduct}
                  onChange={(e) => handleInputChange('isPhysicalProduct', e.target.checked)}
                />
              }
              label="This is a physical product"
            />
          </Grid>
          
          {formData.isPhysicalProduct && (
            <>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Weight
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.0"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    select
                    value={formData.weightUnit}
                    onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                    sx={{ width: 80 }}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="lb">lb</MenuItem>
                    <MenuItem value="oz">oz</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddCustomsInfo}
                  sx={{ borderStyle: 'dashed' }}
                >
                  Add customs information
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductShipping
