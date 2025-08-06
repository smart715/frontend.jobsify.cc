
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ClientListTable from './ClientListTable'

const ClientsList = ({ clientsData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ClientListTable clientsData={clientsData} />
      </Grid>
    </Grid>
  )
}

export default ClientsList
