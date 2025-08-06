
import { useAppSettings } from '@/contexts/appSettingsContext'

export const useGlobalSettings = () => {
  const { settings, formatDate, formatCurrency } = useAppSettings()
  
  return {
    // Settings
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    timezone: settings.defaultTimezone,
    currency: settings.defaultCurrency,
    language: settings.language,
    rowLimit: parseInt(settings.databaseRowLimit),
    
    // Utility functions
    formatDate,
    formatCurrency,
    
    // Feature flags
    isDebugMode: settings.appDebug,
    isCacheEnabled: settings.enableCache,
    isEmailNotificationEnabled: settings.emailNotification,
    isCompanyApprovalRequired: settings.companyNeedApproval
  }
}
