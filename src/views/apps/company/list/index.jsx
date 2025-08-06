// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CompanyListTable from './CompanyListTable'

// import CompanyListCards from './CompanyListCards' // Future placeholder

const CompanyList = () => { // Removed companyData prop
  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}> // Placeholder for future CompanyListCards
        <CompanyListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <CompanyListTable /> {/* Removed tableData prop */}
      </Grid>
    </Grid>
  )
}

export default CompanyList
