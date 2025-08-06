
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
  Divider
} from '@mui/material'

const FileUploadSettings = () => {
  const [formData, setFormData] = useState({
    maxFileSize: '10',
    maxNumberOfFiles: '10',
    allowedFileTypes: [
      'image/*',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/docx',
      'application/pdf',
      'text/plain',
      'application/vnd.ms-word',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-zip-compressed',
      'application/x-compressed',
      'multipart/x-zip',
      'stat.pl',
      'video/x-flv',
      'video/mp4',
      'application/x-mpegURL',
      'video/MP2T',
      'video/3gpp',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'application/zip',
      'gif',
      'application/zip-compressed'
    ]
  })

  const [newFileType, setNewFileType] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFileType = () => {
    if (newFileType.trim() && !formData.allowedFileTypes.includes(newFileType.trim())) {
      setFormData(prev => ({
        ...prev,
        allowedFileTypes: [...prev.allowedFileTypes, newFileType.trim()]
      }))
      setNewFileType('')
    }
  }

  const handleRemoveFileType = (typeToRemove) => {
    setFormData(prev => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.filter(type => type !== typeToRemove)
    }))
  }

  const handleSubmit = () => {
    console.log('Form data:', formData)
    // Handle form submission
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          {/* Server Information */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Server upload_max_filesize:</strong> 2 MB &nbsp;&nbsp;&nbsp;
                  <strong>Service post_max_size:</strong> 8 MB
                </Typography>
              </Alert>
            </Box>
          </Grid>

          {/* Max File Size */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Max File size for upload *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.maxFileSize}
              onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
              InputProps={{
                endAdornment: (
                  <Typography variant="body2" color="text.secondary">
                    MB
                  </Typography>
                )
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Enter lower value than 2 MB
            </Typography>
          </Grid>

          {/* Max Number of Files */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Max number of files for upload *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.maxNumberOfFiles}
              onChange={(e) => handleInputChange('maxNumberOfFiles', e.target.value)}
            />
          </Grid>

          {/* Allowed File Types */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Allowed file types for upload *
            </Typography>
            
            {/* File Type Input */}
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  placeholder="Add file type (e.g., image/*, .pdf, .docx)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddFileType()
                    }
                  }}
                  endAdornment={
                    <Button
                      size="small"
                      onClick={handleAddFileType}
                      sx={{ ml: 1 }}
                    >
                      Add
                    </Button>
                  }
                />
              </FormControl>
            </Box>

            {/* File Type Chips */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              minHeight: 120,
              maxHeight: 200,
              overflowY: 'auto',
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.default'
            }}>
              {formData.allowedFileTypes.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  variant="outlined"
                  size="small"
                  onDelete={() => handleRemoveFileType(type)}
                  sx={{
                    '& .MuiChip-deleteIcon': {
                      color: 'error.main'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#dc3545',
                  '&:hover': {
                    backgroundColor: '#c82333'
                  },
                  textTransform: 'none',
                  px: 4
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FileUploadSettings
