
'use client'

import { useState, useEffect } from 'react'

export const useAppTitle = (sectionName = '') => {
  const [appName, setAppName] = useState('Materialize')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppName = async () => {
      try {
        const response = await fetch('/api/admin/app-settings')
        if (response.ok) {
          const settings = await response.json()
          const appNameSetting = settings.find(setting => setting.key === 'app_name')
          if (appNameSetting?.value) {
            setAppName(appNameSetting.value)
          }
        }
      } catch (error) {
        console.error('Error fetching app name:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppName()
  }, [])

  const getPageTitle = (section) => {
    if (loading) return 'Loading...'
    return section ? `${appName} - ${section}` : appName
  }

  const getDocumentTitle = (section) => {
    if (loading) return 'Loading...'
    return section ? `${section} | ${appName}` : appName
  }

  return {
    appName,
    loading,
    getPageTitle,
    getDocumentTitle
  }
}
