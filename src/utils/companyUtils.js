
// src/utils/companyUtils.js

// Module codes mapping
const MODULE_CODES = {
  'MOBILE_DETAILING': 'MD',
  'PRESSURE_WASHING': 'PW',
  'LAWN_CARE': 'LC',
  'CLEANING_SERVICES': 'CS',
  'HANDYMAN': 'HM',
  'DRUG_SCREENING': 'DS'
}

// Entity codes mapping
const ENTITY_CODES = {
  'COMPANY': 'CO',
  'CUSTOMER': 'CU', 
  'STAFF': 'ST',
  'INVOICE': 'IN',
  'JOB': 'JO',
  'VEHICLE': 'VE',
  'EQUIPMENT': 'EQ'
}

// In-memory storage for counters (in production, this should be in database)
let moduleCompanyCounters = {}; // { MD: 3, PW: 1 } - tracks company count per module
let entityCounters = {}; // { 'MD-0001-ST-25': 7, 'MD-0001-CU-25': 12 }

/**
 * Get the next available company counter for a module by checking database
 */
const getNextCompanyCounter = async (moduleCode) => {
  try {
    // This function will be called from the API route where we have access to Prisma
    // For now, return a placeholder that will be replaced by the API
    return '00001';
  } catch (error) {
    console.error('Error getting next company counter:', error);
    // Fallback to in-memory counter
    if (!moduleCompanyCounters[moduleCode]) {
      moduleCompanyCounters[moduleCode] = 0;
    }
    moduleCompanyCounters[moduleCode] += 1;
    return moduleCompanyCounters[moduleCode].toString().padStart(5, '0');
  }
}

/**
 * Get or initialize entity counter for a specific company/entity/year combination
 */
const getNextEntityCounter = (moduleCode, companyCode, entityCode, year) => {
  const counterKey = `${moduleCode}-${companyCode}-${entityCode}-${year}`;
  
  if (!entityCounters[counterKey]) {
    entityCounters[counterKey] = 0;
  }
  entityCounters[counterKey] += 1;
  return entityCounters[counterKey].toString().padStart(5, '0');
}

/**
 * Generate company ID when registering a new company
 * This is a synchronous version for client-side use
 * The actual counter will be determined by the API
 */
export const generateCompanyId = (moduleType = 'MOBILE_DETAILING') => {
  // Map module names to codes with pattern matching
  const getModuleCode = (moduleType) => {
    const moduleName = moduleType.toUpperCase()
    
    if (moduleName.includes('ADVANCE') && (moduleName.includes('DNA') || moduleName.includes('SCREENING'))) {
      return 'ADS' // Specific handling for ADVANCE_DNA_SERVICE
    } else if (moduleName.includes('DRUG') || moduleName.includes('DNA') || moduleName.includes('SCREENING')) {
      return 'DS'
    } else if (moduleName.includes('MOBILE') && moduleName.includes('DETAILING')) {
      return 'MD'
    } else if (moduleName.includes('PRESSURE') && moduleName.includes('WASHING')) {
      return 'PW'
    } else if (moduleName.includes('LAWN') && moduleName.includes('CARE')) {
      return 'LC'
    } else if (moduleName.includes('CLEANING') && moduleName.includes('SERVICES')) {
      return 'CS'
    } else if (moduleName.includes('HANDYMAN')) {
      return 'HM'
    }
    
    // Fallback to existing mapping or default generation
    const moduleNameToCode = {
      'MOBILE_DETAILING': 'MD',
      'MOBILE DETAILING': 'MD',
      'PRESSURE_WASHING': 'PW', 
      'PRESSURE WASHING': 'PW',
      'DRUG_SCREENING': 'DS',
      'DRUG SCREENING': 'DS',
      'DNA_SERVICES': 'DS',
      'DNA SERVICES': 'DS',
      'ADVANCE_DNA_SERVICE': 'ADS',
      'ADVANCE DNA SERVICE': 'ADS',
      'LAWN_CARE': 'LC',
      'LAWN CARE': 'LC',
      'CLEANING_SERVICES': 'CS',
      'CLEANING SERVICES': 'CS',
      'HANDYMAN': 'HM'
    }
    
    // If not found in mapping, generate dynamically
    if (!moduleNameToCode[moduleName] && !MODULE_CODES[moduleName]) {
      const words = moduleName.split(/\s+/)
      if (words.length === 1) {
        return words[0].substring(0, 2)
      } else if (words.length >= 2) {
        return words.map(word => word.charAt(0)).join('').substring(0, 3)
      }
    }
    
    return moduleNameToCode[moduleName] || MODULE_CODES[moduleName] || 'MD'
  }
  
  const moduleCode = getModuleCode(moduleType);
  const companyCode = '0001'; // Fixed company code
  const entityCode = ENTITY_CODES.COMPANY;
  const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
  
  // Return placeholder - actual counter will be set by API
  return `${moduleCode}-${companyCode}-${entityCode}-${year}-XXXXX`;
}

/**
 * Generate company ID with database lookup (for API use)
 */
export const generateCompanyIdWithDB = async (moduleType = 'MOBILE_DETAILING', prisma) => {
  // Generate module code dynamically from module type
  let moduleCode = 'MD'; // Default fallback
  
  if (moduleType) {
    const words = moduleType.replace(/_/g, ' ').toUpperCase().split(/\s+/);
    if (words.length === 1) {
      // Single word: take first two letters
      moduleCode = words[0].substring(0, 2);
    } else {
      // Multiple words: take first letter of each word
      moduleCode = words.map(word => word.charAt(0)).join('');
    }
  }
  
  console.log(`Generating company ID with moduleType: ${moduleType} -> moduleCode: ${moduleCode}`);
  const companyCode = '0001'; // Fixed company code
  const entityCode = ENTITY_CODES.COMPANY;
  const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
  
  // Get the next available counter from database
  const prefix = `${moduleCode}-${companyCode}-${entityCode}-${year}-`;
  
  try {
    // Find all existing companies with this module code and year
    const existingCompanies = await prisma.company.findMany({
      where: {
        companyId: {
          startsWith: prefix
        }
      },
      select: {
        companyId: true
      },
      orderBy: {
        companyId: 'desc'
      }
    });
    
    let nextCounter = 1;
    
    if (existingCompanies.length > 0) {
      // Extract the counter from the most recent company ID
      const lastCompanyId = existingCompanies[0].companyId;
      const lastCounterStr = lastCompanyId.split('-').pop();
      const lastCounter = parseInt(lastCounterStr);
      nextCounter = lastCounter + 1;
    }
    
    const counterStr = nextCounter.toString().padStart(5, '0');
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-${counterStr}`;
    
  } catch (error) {
    console.error('Error generating company ID from database:', error);
    // Fallback to counter 1 if database lookup fails
    return `${moduleCode}-${companyCode}-${entityCode}-${year}-00001`;
  }
}

/**
 * Generate entity ID for any entity type within a company
 */
export const generateEntityId = (companyId, entityType) => {
  // Parse company ID to extract moduleCode and companyCode
  const parts = companyId.split('-');
  if (parts.length < 2) {
    throw new Error('Invalid company ID format');
  }
  
  const moduleCode = parts[0];
  const companyCode = parts[1];
  const entityCode = ENTITY_CODES[entityType] || 'CU';
  const year = new Date().getFullYear().toString().slice(-2);
  const uniqueCounter = getNextEntityCounter(moduleCode, companyCode, entityCode, year);
  
  return `${moduleCode}-${companyCode}-${entityCode}-${year}-${uniqueCounter}`;
}

/**
 * Validate ID format
 */
export const validateId = (id) => {
  const pattern = /^[A-Z]{2}-\d{4}-[A-Z]{2}-\d{2}-\d{5}$/;
  return pattern.test(id);
}

/**
 * Parse ID into components
 */
export const parseId = (id) => {
  if (!validateId(id)) {
    throw new Error('Invalid ID format');
  }
  
  const parts = id.split('-');
  return {
    moduleCode: parts[0],
    companyCode: parts[1],
    entityCode: parts[2],
    year: parts[3],
    uniqueCounter: parts[4]
  };
}

/**
 * Get module name from code
 */
export const getModuleName = (moduleCode) => {
  const reverseMapping = Object.fromEntries(
    Object.entries(MODULE_CODES).map(([key, value]) => [value, key])
  );
  return reverseMapping[moduleCode] || 'UNKNOWN';
}

/**
 * Get entity name from code
 */
export const getEntityName = (entityCode) => {
  const reverseMapping = Object.fromEntries(
    Object.entries(ENTITY_CODES).map(([key, value]) => [value, key])
  );
  return reverseMapping[entityCode] || 'UNKNOWN';
}

/**
 * Initialize counters from database (call this on app startup)
 */
export const initializeCountersFromDB = async () => {
  try {
    // This would fetch existing IDs from database and rebuild counters
    // For now, we'll implement a simple version
    console.log('Initializing ID counters from database...');
    
    // TODO: Implement database queries to rebuild counters
    // Example:
    // const companies = await fetchAllCompanies();
    // companies.forEach(company => {
    //   const parsed = parseId(company.companyId);
    //   moduleCompanyCounters[parsed.moduleCode] = Math.max(
    //     moduleCompanyCounters[parsed.moduleCode] || 0,
    //     parseInt(parsed.uniqueCounter)
    //   );
    // });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize counters:', error);
    return false;
  }
}

// Export constants for use in other parts of the application
export { MODULE_CODES, ENTITY_CODES };
