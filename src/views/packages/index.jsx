// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import PackageListTable from './PackageListTable'

// import InvoiceCard from './InvoiceCard' // Removed import

const PackageList = () => { // Removed companyData prop
  return (
    <Grid container spacing={6}>
      {/* Grid item for InvoiceCard removed */}
      <Grid size={{ xs: 12 }}>
        <PackageListTable /> {/* Removed companyData prop */}
      </Grid>
    </Grid>
  )
}

export default PackageList
