'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const UploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
}))

const ProductImage = ({ productData, updateProductData }) => {
  const handleFileUpload = (files) => {
    // Handle file upload logic here
    const newImages = [...(productData.images || []), ...Array.from(files)]
    updateProductData('images', newImages)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Media
        </Typography>

        <UploadArea
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
            >
              Upload new
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </Button>
            <Button variant="text">
              Select existing
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Accepts images, videos, or 3D models
          </Typography>
        </UploadArea>
      </CardContent>
    </Card>
  )
}

export default ProductImage