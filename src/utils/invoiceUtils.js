
export const generateInvoiceId = async () => {
  const moduleCode = 'MD' // Default module code
  const companyCode = 'CP' // Default company code
  const year = new Date().getFullYear()
  
  try {
    const response = await fetch('/api/invoices/next-id', {
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
    console.error('Error generating invoice ID:', error)
  }
  
  // Fallback ID generation
  const timestamp = Date.now()
  return `${moduleCode}-${companyCode}-INV-${year}-${timestamp}`
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const calculateUnpaidAmount = (total, paidAmount = 0) => {
  return total - paidAmount
}

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'unpaid':
      return 'error'
    case 'overdue':
      return 'warning'
    default:
      return 'default'
  }
}
