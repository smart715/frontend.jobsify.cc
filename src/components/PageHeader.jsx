
'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

// Custom Hook
import { useAppTitle } from '@/hooks/useAppTitle'

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  updateDocumentTitle = true,
  children 
}) => {
  const { getDocumentTitle, appName } = useAppTitle()

  useEffect(() => {
    if (updateDocumentTitle) {
      document.title = getDocumentTitle(title)
    }
  }, [title, getDocumentTitle, updateDocumentTitle])

  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/dashboards/crm" color="inherit" underline="hover">
            {appName}
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <Link 
              key={index} 
              href={crumb.href} 
              color="inherit" 
              underline="hover"
            >
              {crumb.label}
            </Link>
          ))}
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {children && (
          <Box>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PageHeader
