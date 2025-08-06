
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { Save, Preview, ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const ProductAddHeader = ({ onSave, onPreview, loading = false }) => {
  const router = useRouter()

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Typography variant="h5">
              Add Product
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={onPreview}
              disabled={loading}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductAddHeader
