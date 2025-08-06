/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */
'use server'

// Prisma Client Import

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data Imports
import { db as eCommerceData } from '@/fake-db/apps/ecommerce'
import { db as academyData } from '@/fake-db/apps/academy'
import { db as vehicleData } from '@/fake-db/apps/logistics'
import { db as invoiceData } from '@/fake-db/apps/invoice'
import { db as userData } from '@/fake-db/apps/userList'
import { db as permissionData } from '@/fake-db/apps/permissions'
import { db as profileData } from '@/fake-db/pages/userProfile'
import { db as faqData } from '@/fake-db/pages/faq'
import { db as pricingData } from '@/fake-db/pages/pricing'; // Restored fake db import
import { db as statisticsData } from '@/fake-db/pages/widgetExamples'

export const getEcommerceData = async () => {
  return eCommerceData
}

export const getAcademyData = async () => {
  return academyData
}

export const getLogisticsData = async () => {
  return vehicleData
}

export const getInvoiceData = async () => {
  return invoiceData
}

export const getUserData = async () => {
  return userData
}

export const getPermissionsData = async () => {
  return permissionData
}

export const getProfileData = async () => {
  return profileData
}

export const getFaqData = async () => {
  return faqData
}

export const getPricingData = async () => {
  try {
    const pricingTiers = await prisma.pricingTier.findMany({
      orderBy: {
        price: 'asc', // Order by price, ascending
      },
    });

    // Parse the 'features' JSON string back into an array for each tier.
    const tiersWithParsedFeatures = pricingTiers.map(tier => {
      try {
        // Check if features is already an array
        if (Array.isArray(tier.features)) {
          return {
            ...tier,
            features: tier.features
          };
        }
        
        // If features is a string, try to parse as JSON
        if (typeof tier.features === 'string') {
          // First check if it's already valid JSON
          try {
            return {
              ...tier,
              features: JSON.parse(tier.features)
            };
          } catch (jsonError) {
            // If not valid JSON, treat as comma-separated string or single feature
            const featuresArray = tier.features.includes(',') 
              ? tier.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
              : tier.features.trim() ? [tier.features.trim()] : [];
              
            return {
              ...tier,
              features: featuresArray
            };
          }
        }
        
        // Default fallback
        return {
          ...tier,
          features: []
        };
      } catch (e) {
        console.error(`Error parsing features for tier ${tier.name} in getPricingData:`, e);

        return {
          ...tier,
          features: [], // Fallback to empty array if parsing fails
        };
      }
    });

    // Assuming PricingWrapper can handle an array of these tier objects directly.
    // If it expects an object like { pricingPlans: tiersWithParsedFeatures }, adjust here.
    return tiersWithParsedFeatures;

  } catch (error) {
    console.error('Error fetching pricing tiers in server action:', error);

    // Return empty array on error, or handle as appropriate for the page.

    return [];
  }
};

export const getStatisticsData = async () => {
  return statisticsData
}
