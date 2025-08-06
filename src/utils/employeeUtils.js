
export const generateEmployeeId = async () => {
  const moduleCode = 'MD' // Default module code
  const companyCode = 'CP' // Default company code
  const year = new Date().getFullYear()
  
  try {
    const response = await fetch('/api/employees/next-id', {
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
    console.error('Error generating employee ID:', error)
  }
  
  // Fallback ID generation
  const timestamp = Date.now()
  return `${moduleCode}-${companyCode}-EMP-${year}-${timestamp}`
}

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'warning'
    case 'terminated':
      return 'error'
    default:
      return 'default'
  }
}

export const getDepartments = () => [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Legal',
  'IT',
  'Other'
]

export const getDesignations = () => [
  'Manager',
  'Senior Developer',
  'Developer',
  'Junior Developer',
  'Designer',
  'Analyst',
  'Consultant',
  'Coordinator',
  'Specialist',
  'Executive',
  'Director',
  'VP',
  'Other'
]
