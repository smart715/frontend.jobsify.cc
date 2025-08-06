
export const generateLeadId = async () => {
  const moduleCode = 'MD' // Default module code
  const companyCode = 'CP' // Default company code
  const year = new Date().getFullYear()
  
  try {
    const response = await fetch('/api/leads/next-id', {
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
    console.error('Error generating lead ID:', error)
  }
  
  // Fallback ID generation
  const timestamp = Date.now()
  return `${moduleCode}-${companyCode}-LD-${year}-${timestamp}`
}

export const getLeadStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'new':
      return 'info'
    case 'contacted':
      return 'primary'
    case 'qualified':
      return 'success'
    case 'converted':
      return 'success'
    case 'lost':
      return 'error'
    default:
      return 'default'
  }
}

export const getLeadSources = () => [
  'Website',
  'Referral',
  'Cold Call',
  'Email Campaign',
  'Social Media',
  'Trade Show',
  'Advertisement',
  'Partner',
  'Other'
]
