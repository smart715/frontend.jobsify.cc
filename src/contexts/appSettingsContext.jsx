'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppSettingsContext = createContext()

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}

export const AppSettingsProvider = ({ children }) => {
  // Default settings
  const defaultSettings = {
    dateFormat: 'd-m-Y H:i:s',
    timeFormat: '12',
    defaultTimezone: 'Asia/Kolkata',
    defaultCurrency: 'USD',
    language: 'en',
    databaseRowLimit: '25',
    sessionDriver: 'file',
    appDebug: false,
    appUpdate: false,
    enableCache: false,
    emailNotification: false,
    companyNeedApproval: false,
    maxFileSize: '10',
    maxNumberOfFiles: '10',
    googleMapKey: ''
  }
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/app-settings')
      const result = await response.json()

      if (result.success && result.data) {
        const mappedSettings = {
          dateFormat: result.data.date_format || 'd-m-Y H:i:s',
          timeFormat: result.data.time_format || '12',
          defaultTimezone: result.data.default_timezone || 'Asia/Kolkata',
          defaultCurrency: result.data.default_currency || 'USD',
          language: result.data.language || 'en',
          databaseRowLimit: result.data.database_row_limit || '25',
          sessionDriver: result.data.session_driver || 'file',
          appDebug: result.data.app_debug === 'true',
          appUpdate: result.data.app_update === 'true',
          enableCache: result.data.enable_cache === 'true',
          emailNotification: result.data.email_notification === 'true',
          companyNeedApproval: result.data.company_need_approval === 'true',
          maxFileSize: result.data.max_file_size || '10',
          maxNumberOfFiles: result.data.max_number_of_files || '10',
          googleMapKey: result.data.google_map_key || ''
        }
        setSettings(mappedSettings)
      }
    } catch (error) {
      console.error('Failed to load app settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch('/api/admin/app-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      })

      const result = await response.json()

      if (result.success) {
        // Update local state with new settings
        setSettings(prev => ({ ...prev, ...newSettings }))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Failed to update app settings:', error)
      return { success: false, error: 'Failed to update settings' }
    }
  }

  const formatDate = (date, format = null) => {
    const dateFormat = format || settings.dateFormat
    const dateObj = new Date(date)

    // Convert PHP date format to JavaScript date format
    let jsFormat = dateFormat
      .replace('d', 'DD')
      .replace('m', 'MM')
      .replace('Y', 'YYYY')
      .replace('H', 'HH')
      .replace('i', 'mm')
      .replace('s', 'ss')

    // Simple date formatting (you might want to use a library like date-fns or moment.js)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    const seconds = String(dateObj.getSeconds()).padStart(2, '0')

    return jsFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }

  const formatCurrency = (amount, currency = null) => {
    const currencyCode = currency || settings.defaultCurrency
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    }

    const symbol = currencySymbols[currencyCode] || '$'
    return `${symbol}${Number(amount).toFixed(2)}`
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const contextValue = {
    settings,
    loading,
    updateSettings,
    loadSettings,
    formatDate,
    formatCurrency
  }

  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  )
}