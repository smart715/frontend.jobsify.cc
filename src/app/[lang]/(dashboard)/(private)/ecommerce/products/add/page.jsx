
'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box } from '@mui/material'

// Component Imports
import ProductAddHeader from '@views/apps/ecommerce/products/add/ProductAddHeader'
import ProductInformation from '@views/apps/ecommerce/products/add/ProductInformation'
import ProductImage from '@views/apps/ecommerce/products/add/ProductImage'
import ProductPricing from '@views/apps/ecommerce/products/add/ProductPricing'
import ProductInventory from '@views/apps/ecommerce/products/add/ProductInventory'
import ProductShipping from '@views/apps/ecommerce/products/add/ProductShipping'
import ProductVariants from '@views/apps/ecommerce/products/add/ProductVariants'
import ProductSEO from '@views/apps/ecommerce/products/add/ProductSEO'
import ProductOrganize from '@views/apps/ecommerce/products/add/ProductOrganize'

const eCommerceProductsAdd = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    sku: '',
    trackQuantity: true,
    quantity: 0,
    weight: '',
    weightUnit: 'kg',
    requiresShipping: true,
    taxable: true,
    status: 'DRAFT',
    vendor: '',
    productType: '',
    tags: [],
    images: [],
    variants: [],
    categories: [],
    seoTitle: '',
    seoDescription: ''
  })

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ecommerce/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Product saved successfully:', result)
        // Redirect to product list or show success message
        window.location.href = '/ecommerce/products/list'
      } else {
        console.error('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    console.log('Preview product:', productData)
    // Implement preview functionality
  }

  const updateProductData = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <ProductAddHeader 
          onSave={handleSave}
          onPreview={handlePreview}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={12}>
            <ProductInformation 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductImage 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductPricing 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductInventory 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductShipping 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductVariants 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
          <Grid size={12}>
            <ProductSEO 
              productData={productData}
              updateProductData={updateProductData}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ProductOrganize 
          productData={productData}
          updateProductData={updateProductData}
        />
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
