
import React, { useState, useEffect } from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PackageDropdown = ({ onChange, value }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Fetch module details for each package
        const packagesWithModules = await Promise.all(
          data.map(async (pkg) => {
            let moduleNames = [];
            
            if (pkg.modules && pkg.modules.length > 0) {
              try {
                // Handle modules as array of IDs or JSON string
                let moduleIds = pkg.modules;
                if (typeof pkg.modules === 'string') {
                  try {
                    moduleIds = JSON.parse(pkg.modules);
                  } catch (e) {
                    moduleIds = [pkg.modules]; // Single module ID as string
                  }
                }
                
                // Fetch module names for each ID
                for (const moduleId of moduleIds) {
                  if (moduleId && typeof moduleId === 'string' && moduleId.length > 1) {
                    try {
                      const moduleResponse = await fetch(`/api/modules/${moduleId}`);
                      if (moduleResponse.ok) {
                        const moduleData = await moduleResponse.json();
                        moduleNames.push(moduleData.name);
                      }
                    } catch (error) {
                      console.error(`Error fetching module ${moduleId}:`, error);
                    }
                  }
                }
              } catch (error) {
                console.error('Error processing modules for package:', pkg.name, error);
              }
            }
            
            return {
              ...pkg,
              moduleNames: moduleNames.length > 0 ? moduleNames : ['No modules']
            };
          })
        );
        
        setPackages(packagesWithModules);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <p>Loading packages...</p>;
  }

  if (error) {
    return <p>Error loading packages: {error}</p>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="package-select-label">Package</InputLabel>
      <Select
        labelId="package-select-label"
        id="package-select"
        value={value}
        label="Package"
        onChange={onChange}
      >
        {packages.map((pkg) => (
          <MenuItem key={pkg.id} value={pkg.id}>
            {pkg.name} - {pkg.moduleNames.join(', ')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PackageDropdown;
