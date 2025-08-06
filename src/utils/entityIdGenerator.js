
// src/utils/entityIdGenerator.js

import { generateEntityId, ENTITY_CODES } from './companyUtils.js'

/**
 * Generate customer ID for a company
 */
export const generateCustomerId = (companyId) => {
  return generateEntityId(companyId, 'CUSTOMER')
}

/**
 * Generate staff ID for a company
 */
export const generateStaffId = (companyId) => {
  return generateEntityId(companyId, 'STAFF')
}

/**
 * Generate invoice ID for a company
 */
export const generateInvoiceId = (companyId) => {
  return generateEntityId(companyId, 'INVOICE')
}

/**
 * Generate job ID for a company
 */
export const generateJobId = (companyId) => {
  return generateEntityId(companyId, 'JOB')
}

/**
 * Generate vehicle ID for a company
 */
export const generateVehicleId = (companyId) => {
  return generateEntityId(companyId, 'VEHICLE')
}

/**
 * Generate equipment ID for a company
 */
export const generateEquipmentId = (companyId) => {
  return generateEntityId(companyId, 'EQUIPMENT')
}

// Export all entity generators
export const entityGenerators = {
  CUSTOMER: generateCustomerId,
  STAFF: generateStaffId,
  INVOICE: generateInvoiceId,
  JOB: generateJobId,
  VEHICLE: generateVehicleId,
  EQUIPMENT: generateEquipmentId
}
