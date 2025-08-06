
// Example usage patterns for toast notifications across the application
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast, showLoadingToast, updateToast } from '@/utils/toast'

// Example 1: Simple success/error notifications
export const handleSimpleOperation = async () => {
  try {
    const response = await fetch('/api/some-endpoint')
    if (response.ok) {
      showSuccessToast('Operation completed successfully!')
    } else {
      showErrorToast('Operation failed. Please try again.')
    }
  } catch (error) {
    showErrorToast('An unexpected error occurred.')
  }
}

// Example 2: Loading state with update
export const handleOperationWithLoading = async () => {
  const loadingToastId = showLoadingToast('Processing...')
  
  try {
    const response = await fetch('/api/some-endpoint')
    if (response.ok) {
      updateToast(loadingToastId, 'Operation completed successfully!', 'success')
    } else {
      updateToast(loadingToastId, 'Operation failed. Please try again.', 'error')
    }
  } catch (error) {
    updateToast(loadingToastId, 'An unexpected error occurred.', 'error')
  }
}

// Example 3: Different types of notifications
export const showDifferentNotifications = () => {
  showSuccessToast('Data saved successfully!')
  showErrorToast('Failed to delete record')
  showWarningToast('This action cannot be undone')
  showInfoToast('New features are available')
}

// Example 4: Custom configuration
export const showCustomToast = () => {
  showSuccessToast('Custom success message', {
    autoClose: 10000, // 10 seconds
    position: 'bottom-center',
  })
}

// Example 5: Form validation warnings
export const showValidationWarnings = (errors) => {
  if (errors.length > 0) {
    showWarningToast(`Please fix ${errors.length} validation error(s)`)
  }
}

// Example 6: Network status notifications
export const handleNetworkError = (error) => {
  if (error.code === 'NETWORK_ERROR') {
    showErrorToast('Network connection failed. Please check your internet connection.')
  } else if (error.code === 'TIMEOUT') {
    showWarningToast('Request timed out. Please try again.')
  } else {
    showErrorToast('An unexpected error occurred.')
  }
}
