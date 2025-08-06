'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Rich text editor toolbar
const EditorToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
}))

const ToolbarButton = styled('button')(({ theme }) => ({
  padding: theme.spacing(0.5),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

const ProductInformation = ({ productData, updateProductData }) => {
  const [description, setDescription] = useState(productData.description || '')

  const handleTitleChange = (e) => {
    updateProductData('name', e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    updateProductData('description', e.target.value)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="Short sleeve t-shirt"
            value={productData.name || ''}
            onChange={handleTitleChange}
          />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Description
          </Typography>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <EditorToolbar>
              <select style={{ border: 'none', background: 'none', fontSize: '14px' }}>
                <option>Paragraph</option>
              </select>
              <ToolbarButton>
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton>
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton>
                <u>U</u>
              </ToolbarButton>
              <ToolbarButton>A</ToolbarButton>
              <ToolbarButton>≡</ToolbarButton>
              <ToolbarButton>🔗</ToolbarButton>
              <ToolbarButton>📷</ToolbarButton>
              <ToolbarButton>😊</ToolbarButton>
              <ToolbarButton>⋯</ToolbarButton>
              <Box sx={{ marginLeft: 'auto' }}>
                <ToolbarButton>&lt;/&gt;</ToolbarButton>
              </Box>
            </EditorToolbar>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter product description..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductInformation