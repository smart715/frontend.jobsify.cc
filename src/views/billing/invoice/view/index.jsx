'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'

const BillingInvoicePreview = ({ invoiceData, id }) => {
  // States
  const [data, setData] = useState(invoiceData)

  const handleButtonClick = () => {
    window.print()
  }

  if (!invoiceData) {
    return <div>Invoice not found</div>
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 9 }}>
          <PreviewCard invoiceData={data} id={id} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <PreviewActions id={id} onButtonClick={handleButtonClick} invoiceData={data} />
        </Grid>
      </Grid>
    </>
  )
}

export default BillingInvoicePreview