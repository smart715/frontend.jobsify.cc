
/**
 * Get location information from IP address using free geolocation services
 * @param {string} ipAddress - The IP address to geolocate
 * @returns {Promise<string>} - Location string or fallback
 */
export async function getLocationFromIP(ipAddress) {
  if (!ipAddress || ipAddress === 'Unknown' || ipAddress === '127.0.0.1' || ipAddress === '::1') {
    return 'Unknown'
  }

  const cleanIpAddress = ipAddress.toString().split(',')[0].trim()
  
  // Try multiple geolocation services for better reliability
  const services = [
    {
      name: 'ip-api',
      url: `http://ip-api.com/json/${cleanIpAddress}?fields=status,country,regionName,city,query`,
      parser: (data) => {
        if (data.status === 'success') {
          const locationParts = []
          if (data.city) locationParts.push(data.city)
          if (data.regionName) locationParts.push(data.regionName)
          if (data.country) locationParts.push(data.country)
          return locationParts.join(', ')
        }
        return null
      }
    },
    {
      name: 'ipinfo',
      url: `https://ipinfo.io/${cleanIpAddress}/json`,
      parser: (data) => {
        if (data.city && data.region && data.country) {
          return `${data.city}, ${data.region}, ${data.country}`
        } else if (data.country) {
          return data.country
        }
        return null
      }
    }
  ]

  for (const service of services) {
    try {
      const response = await fetch(service.url, {
        timeout: 5000 // 5 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        const location = service.parser(data)
        
        if (location) {
          return location
        }
      }
    } catch (error) {
      console.error(`Error with ${service.name} geolocation service:`, error)
      continue
    }
  }

  // If all services fail, return IP address
  return `IP: ${cleanIpAddress}`
}

/**
 * Format location string for display
 * @param {string} location - Raw location string
 * @param {string} ipAddress - Fallback IP address
 * @returns {string} - Formatted location string
 */
export function formatLocationDisplay(location, ipAddress) {
  if (location && location !== 'Unknown') {
    return location
  }
  
  if (ipAddress && ipAddress !== 'Unknown') {
    return `IP: ${ipAddress}`
  }
  
  return 'Unknown Location'
}
