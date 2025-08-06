
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, TextField, Grid, Box, Button } from '@mui/material'
import { Edit } from '@mui/icons-material'

const ProductSEO = ({ productData = {}, updateProductData }) => {
  const [formData, setFormData] = useState({
    seoTitle: productData.seoTitle || '',
    seoDescription: productData.seoDescription || '',
    seoUrl: productData.seoUrl || '',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Search engine listing
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            size="small"
          >
            Edit
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add a title and description to see how this product might appear in a search engine listing
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Page title"
              value={formData.seoTitle}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              placeholder="Enter SEO title"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta description"
              multiline
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              placeholder="Enter meta description"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL handle"
              value={formData.seoUrl}
              onChange={(e) => handleInputChange('seoUrl', e.target.value)}
              placeholder="Enter URL handle"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductSEO
