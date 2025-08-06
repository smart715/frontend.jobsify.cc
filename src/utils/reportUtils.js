
export const generateReportId = async () => {
  const moduleCode = 'MD' // Default module code
  const companyCode = 'CP' // Default company code
  const year = new Date().getFullYear()
  
  try {
    const response = await fetch('/api/reports/next-id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.nextId
    }
  } catch (error) {
    console.error('Error generating report ID:', error)
  }
  
  // Fallback ID generation
  const timestamp = Date.now()
  return `${moduleCode}-${companyCode}-RPT-${year}-${timestamp}`
}

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success'
    case 'in progress':
      return 'primary'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

export const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'error'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
      return 'success'
    default:
      return 'default'
  }
}

export const getReportTypes = () => [
  'Task Report',
  'Sales Report',
  'Financial Report',
  'Performance Report',
  'Client Report',
  'Employee Report',
  'Project Report',
  'Custom Report'
]
