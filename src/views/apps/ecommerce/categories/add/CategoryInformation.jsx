
'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import { ShoppingBag } from '@mui/icons-material'

const CategoryInformation = ({ data, setData }) => {
  const [collectionType, setCollectionType] = useState('manual')

  const handleInputChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Summer collection, Under $100, Staff picks"
            value={data.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write a description..."
            value={data.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Collection Type */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Collection type
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={collectionType}
              onChange={(e) => {
                setCollectionType(e.target.value)
                handleInputChange('collectionType', e.target.value)
              }}
            >
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Manual
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add products to this collection one by one. Learn more about manual collections.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="smart"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Smart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Existing and future products that match the conditions you set will automatically be added to this collection. Learn more about smart collections.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Products
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search products"
                sx={{ minWidth: '200px' }}
              />
              <Button variant="outlined">
                Browse
              </Button>
              <FormControl size="small" sx={{ minWidth: '150px' }}>
                <InputLabel>Sort: Best selling</InputLabel>
                <Select
                  value="best-selling"
                  label="Sort: Best selling"
                >
                  <MenuItem value="best-selling">Best selling</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              color: 'text.secondary'
            }}
          >
            <ShoppingBag sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              There are no products in this collection.
            </Typography>
            <Typography variant="body2">
              Search or browse to add products.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Search Engine Listing */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Search engine listing
            </Typography>
            <Button variant="text" size="small">
              Edit
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Add a title and description to see how this collection might appear in a search engine listing
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CategoryInformation
