
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import { Add } from '@mui/icons-material'

const ProductVariants = ({ productData = {}, updateProductData }) => {
  const [formData, setFormData] = useState({
    variants: productData.variants || [],
    ...productData
  })

  const handleAddVariant = () => {
    // Logic to add variant options
    console.log('Add variant option')
  }

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    updateProductData?.(updatedData)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Variants
        </Typography>
        
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddVariant}
            sx={{ borderStyle: 'dashed' }}
          >
            Add options like size or color
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductVariants
