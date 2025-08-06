
// Client ID generation utilities
// Format: [moduleCode]-[companyCode]-CU-[year]-[uniqueCounter]

/**
 * Generate client ID (synchronous version for client-side preview)
 */
export const generateClientId = (moduleCode = 'XX', companyCode = '0000') => {
  const year = new Date().getFullYear().toString().slice(-2);
  const entityCode = 'CU';
  
  // Return placeholder - actual counter will be set by API
  return `${moduleCode}-${companyCode}-${entityCode}-${year}-XXXXX`;
}

/**
 * Generate client ID with database lookup (for API use)
 */
export const generateClientIdWithDB = async (prisma, moduleCode, companyCode) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const entityCode = 'CU';
  const prefix = `${moduleCode}-${companyCode}-${entityCode}-${year}-`;
  
  // Check if prisma is defined and has the required methods
  if (!prisma || typeof prisma !== 'object') {
    console.error('Prisma client is undefined or invalid:', typeof prisma);
    throw new Error('Database connection not available');
  }

  // Validate prisma client has the required models
  if (!prisma.client) {
    console.error('Prisma client model is not available');
    throw new Error('Database client model not properly initialized');
  }
  
  try {
    // Find all existing clients with this prefix
    const existingClients = await prisma.client.findMany({
      where: {
        clientId: {
          startsWith: prefix
        }
      },
      select: {
        clientId: true
      },
      orderBy: {
        clientId: 'desc'
      }
    });
    
    let nextCounter = 1;
    
    if (existingClients.length > 0) {
      // Extract the counter from the most recent client ID
      const lastClientId = existingClients[0].clientId;
      const lastCounterStr = lastClientId.split('-').pop();
      const lastCounter = parseInt(lastCounterStr);
      if (!isNaN(lastCounter)) {
        nextCounter = lastCounter + 1;
      }
    }
    
    const counterStr = nextCounter.toString().padStart(5, '0');
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-${counterStr}`;
    
  } catch (error) {
    console.error('Error generating client ID from database:', error);
    // Fallback to counter 1 if database lookup fails
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-00001`;
  }
}
