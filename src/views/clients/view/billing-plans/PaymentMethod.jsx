
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const PaymentMethod = () => {
  const paymentMethods = [
    {
      type: 'Mastercard',
      number: '**** **** **** 1234',
      expiry: '12/25',
      default: true
    },
    {
      type: 'Visa',
      number: '**** **** **** 5678',
      expiry: '08/24',
      default: false
    }
  ]

  return (
    <Card>
      <CardHeader title='Payment Methods' />
      <CardContent>
        <Grid container spacing={4}>
          {paymentMethods.map((method, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <div className='border rounded p-4'>
                <div className='flex justify-between items-start mbe-4'>
                  <div className='flex items-center gap-2'>
                    <i className='ri-bank-card-line text-2xl' />
                    <Typography variant='h6'>{method.type}</Typography>
                  </div>
                  {method.default && (
                    <Typography variant='caption' className='bg-primary text-white px-2 py-1 rounded'>
                      Default
                    </Typography>
                  )}
                </div>
                <Typography className='mbe-2'>{method.number}</Typography>
                <Typography color='text.secondary'>
                  Expires {method.expiry}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PaymentMethod
