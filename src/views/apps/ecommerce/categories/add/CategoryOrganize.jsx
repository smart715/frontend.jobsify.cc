
'use client'

import { 
  Card, 
  CardContent, 
  Typography, 
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'

const CategoryOrganize = ({ data, setData }) => {
  const handleInputChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSalesChannelChange = (channel, checked) => {
    setData(prev => ({
      ...prev,
      salesChannels: {
        ...prev.salesChannels,
        [channel]: checked
      }
    }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Publishing */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Publishing
            </Typography>
            <Button variant="text" size="small" color="primary">
              Manage
            </Button>
          </Box>
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
              Sales channels
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    defaultChecked
                    onChange={(e) => handleSalesChannelChange('onlineStore', e.target.checked)}
                  />
                }
                label="Online Store"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    onChange={(e) => handleSalesChannelChange('pointOfSale', e.target.checked)}
                  />
                }
                label="Point of Sale"
              />
            </FormGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Image */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Image
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Button variant="outlined" component="label">
              Add image
              <input type="file" hidden accept="image/*" />
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              or drop an image to upload
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Theme Template */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Theme template
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Default collection</InputLabel>
            <Select
              value={data.themeTemplate || 'default'}
              label="Default collection"
              onChange={(e) => handleInputChange('themeTemplate', e.target.value)}
            >
              <MenuItem value="default">Default collection</MenuItem>
              <MenuItem value="featured">Featured collection</MenuItem>
              <MenuItem value="grid">Grid collection</MenuItem>
              <MenuItem value="list">List collection</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CategoryOrganize
