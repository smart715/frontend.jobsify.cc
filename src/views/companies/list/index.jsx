// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CompanyListTable from './CompanyListTable'

const CompanyList = ({ companyData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CompanyListTable companyData={companyData} />
      </Grid>
    </Grid>
  )
}

export default CompanyList
