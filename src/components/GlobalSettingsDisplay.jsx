
'use client'

import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { useGlobalSettings } from '@/hooks/useGlobalSettings'

const GlobalSettingsDisplay = () => {
  const {
    dateFormat,
    timeFormat,
    timezone,
    currency,
    language,
    rowLimit,
    formatDate,
    formatCurrency,
    isDebugMode,
    isCacheEnabled,
    isEmailNotificationEnabled,
    isCompanyApprovalRequired
  } = useGlobalSettings()

  const currentDate = new Date()
  const sampleAmount = 1234.56

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Global Settings
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={`Date Format: ${dateFormat}`} />
          <Chip label={`Time Format: ${timeFormat}h`} />
          <Chip label={`Timezone: ${timezone}`} />
          <Chip label={`Currency: ${currency}`} />
          <Chip label={`Language: ${language}`} />
          <Chip label={`Row Limit: ${rowLimit}`} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Formatted Date:</strong> {formatDate(currentDate)}
          </Typography>
          <Typography variant="body2">
            <strong>Formatted Currency:</strong> {formatCurrency(sampleAmount)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="Debug Mode" 
            color={isDebugMode ? 'success' : 'default'} 
            variant={isDebugMode ? 'filled' : 'outlined'} 
          />
          <Chip 
            label="Cache Enabled" 
            color={isCacheEnabled ? 'success' : 'default'} 
            variant={isCacheEnabled ? 'filled' : 'outlined'} 
          />
          <Chip 
            label="Email Notifications" 
            color={isEmailNotificationEnabled ? 'success' : 'default'} 
            variant={isEmailNotificationEnabled ? 'filled' : 'outlined'} 
          />
          <Chip 
            label="Company Approval Required" 
            color={isCompanyApprovalRequired ? 'success' : 'default'} 
            variant={isCompanyApprovalRequired ? 'filled' : 'outlined'} 
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default GlobalSettingsDisplay
