'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const InvoiceCard = ({ companyData }) => {
  // Hooks
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  let activeCompaniesCount = 'N/A'

  if (companyData && companyData.length > 0) {
    activeCompaniesCount = companyData.filter(company => company.status === 'Active').length
  }

  const data = [
    {
      title: activeCompaniesCount,
      subtitle: 'Companies',
      icon: 'ri-user-3-line'
    },
    {
      title: 'N/A',
      subtitle: 'Invoices',
      icon: 'ri-pages-line'
    },
    {
      title: 'N/A',
      subtitle: 'Paid',
      icon: 'ri-wallet-line'
    },
    {
      title: 'N/A',
      subtitle: 'Unpaid',
      icon: 'ri-money-dollar-circle-line'
    }
  ]

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              className='sm:[&:nth-of-type(odd)>div]:pie-6 sm:[&:nth-of-type(odd)>div]:border-ie md:[&:not(:last-child)>div]:pie-6 md:[&:not(:last-child)>div]:border-ie'
            >
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <Typography variant='h4'>{item.title}</Typography>
                  <Typography>{item.subtitle}</Typography>
                </div>
                <CustomAvatar variant='rounded' size={42}>
                  <i className={classnames('text-[26px]', item.icon)} />
                </CustomAvatar>
              </div>
              {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default InvoiceCard
