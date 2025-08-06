
export const generateOrderId = async () => {
  const moduleCode = 'MD' // Default module code
  const companyCode = 'CP' // Default company code
  const year = new Date().getFullYear()
  
  try {
    const response = await fetch('/api/orders/next-id', {
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
    console.error('Error generating order ID:', error)
  }
  
  // Fallback ID generation
  const timestamp = Date.now()
  return `${moduleCode}-${companyCode}-ORD-${year}-${timestamp}`
}

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'primary'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0)
}
