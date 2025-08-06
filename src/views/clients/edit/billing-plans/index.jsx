
'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CurrentPlan from './CurrentPlan'
import PaymentMethod from './PaymentMethod'
import Address from './Address'
import InvoiceListTable from './InvoiceListTable'

const BillingPlansTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CurrentPlan />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PaymentMethod />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Address />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable />
      </Grid>
    </Grid>
  )
}

export default BillingPlansTab
