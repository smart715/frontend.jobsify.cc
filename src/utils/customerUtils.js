
// Customer ID generation utilities
// Format: [moduleCode]-[companyCode]-CU-[year]-[uniqueCounter]

/**
 * Generate customer ID (synchronous version for client-side preview)
 */
export const generateCustomerId = (moduleCode = 'XX', companyCode = '0000') => {
  const year = new Date().getFullYear().toString().slice(-2);
  const entityCode = 'CU';
  
  // Return placeholder - actual counter will be set by API
  return `${moduleCode}-${companyCode}-${entityCode}-${year}-XXXXX`;
}

/**
 * Generate customer ID with database lookup (for API use)
 */
export const generateCustomerIdWithDB = async (prisma, moduleCode, companyCode) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const entityCode = 'CU';
  const prefix = `${moduleCode}-${companyCode}-${entityCode}-${year}-`;
  
  try {
    // Find all existing customers with this prefix
    const existingCustomers = await prisma.customer.findMany({
      where: {
        customerId: {
          startsWith: prefix
        }
      },
      select: {
        customerId: true
      },
      orderBy: {
        customerId: 'desc'
      }
    });
    
    let nextCounter = 1;
    
    if (existingCustomers.length > 0) {
      // Extract the counter from the most recent customer ID
      const lastCustomerId = existingCustomers[0].customerId;
      const lastCounterStr = lastCustomerId.split('-').pop();
      const lastCounter = parseInt(lastCounterStr);
      nextCounter = lastCounter + 1;
    }
    
    const counterStr = nextCounter.toString().padStart(5, '0');
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-${counterStr}`;
    
  } catch (error) {
    console.error('Error generating customer ID from database:', error);
    // Fallback to counter 1 if database lookup fails
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-00001`;
  }
}

/**
 * Parse customer ID to extract components
 */
export const parseCustomerId = (customerId) => {
  const parts = customerId.split('-');
  if (parts.length !== 5) {
    throw new Error('Invalid customer ID format');
  }
  
  return {
    moduleCode: parts[0],
    companyCode: parts[1],
    entityCode: parts[2],
    year: parts[3],
    counter: parts[4]
  };
}
