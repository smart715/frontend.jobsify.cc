'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid2'

// Component Imports
import CategoryAddHeader from '@views/apps/ecommerce/categories/add/CategoryAddHeader'
import CategoryInformation from '@views/apps/ecommerce/categories/add/CategoryInformation'
import CategoryOrganize from '@views/apps/ecommerce/categories/add/CategoryOrganize'

const eCommerceCategoriesAdd = () => {
  const [categoryData, setCategoryData] = useState({
    title: '',
    description: '',
    image: null,
    collectionType: 'manual',
    themeTemplate: 'default',
    products: []
  })

  const handleSave = async (isDraft = false) => {
    try {
      const response = await fetch('/api/ecommerce/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...categoryData,
          status: isDraft ? 'draft' : 'published'
        })
      })

      if (response.ok) {
        // Redirect to categories list or show success message
        window.location.href = '/ecommerce/categories'
      }
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CategoryAddHeader onSave={handleSave} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CategoryInformation 
              data={categoryData} 
              setData={setCategoryData} 
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CategoryOrganize 
          data={categoryData} 
          setData={setCategoryData} 
        />
      </Grid>
    </Grid>
  )
}

export default eCommerceCategoriesAdd