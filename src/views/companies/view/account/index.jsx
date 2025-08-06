
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AccountDetails from './AccountDetails'

const AccountTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AccountDetails />
      </Grid>
    </Grid>
  )
}

export default AccountTab
