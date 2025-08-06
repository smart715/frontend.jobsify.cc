
// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'

const PreviewCard = ({ invoiceData: data, id }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'OVERDUE':
        return 'error'
      case 'DRAFT':
        return 'secondary'
      default:
        return 'default'
    }
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Calculate subtotal and tax
  const subtotal = data?.amount || 0
  const taxRate = 0.21 // 21% tax
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'>Office 149, 450 South Brand Brooklyn</Typography>
                    <Typography color='text.primary'>San Diego County, CA 91905, USA</Typography>
                    <Typography color='text.primary'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Invoice ${data?.invoiceId || data?.id}`}</Typography>
                  <div className='flex flex-col gap-2'>
                    <Chip 
                      label={data?.status || 'PENDING'} 
                      variant='tonal' 
                      color={getStatusColor(data?.status)} 
                      size='small' 
                    />
                    <div className='flex flex-col gap-1'>
                      <Typography color='text.primary'>{`Date Issued: ${formatDate(data?.startDate || data?.createdAt)}`}</Typography>
                      <Typography color='text.primary'>{`Date Due: ${formatDate(data?.dueDate)}`}</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>{data?.company?.companyName || 'Company Name'}</Typography>
                    <Typography>{data?.company?.companyEmail || 'company@example.com'}</Typography>
                    <Typography>{data?.company?.companyAddress || 'Company Address'}</Typography>
                    <Typography>{data?.company?.companyPhone || 'Phone Number'}</Typography>
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Total Due:</Typography>
                      <Typography>${data?.unpaidAmount || data?.amount || 0}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Bank name:</Typography>
                      <Typography>American Bank</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Country:</Typography>
                      <Typography>United States</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>IBAN:</Typography>
                      <Typography>ETD95476213874685</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>SWIFT code:</Typography>
                      <Typography>BR91905</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead>
                  <tr className='border-be'>
                    <th className='!bg-transparent'>Item</th>
                    <th className='!bg-transparent'>Description</th>
                    <th className='!bg-transparent'>Duration</th>
                    <th className='!bg-transparent'>Qty</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Typography color='text.primary'>{data?.projectName || 'Package Subscription'}</Typography>
                    </td>
                    <td>
                      <Typography color='text.primary'>
                        {data?.notes || 'Package subscription upgrade'}
                      </Typography>
                    </td>
                    <td>
                      <Typography color='text.primary'>{data?.duration || '1 month'}</Typography>
                    </td>
                    <td>
                      <Typography color='text.primary'>1</Typography>
                    </td>
                    <td>
                      <Typography color='text.primary'>${data?.amount || 0}</Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>Admin Team</Typography>
                </div>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${subtotal}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $0
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${taxAmount.toFixed(2)}
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${total.toFixed(2)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              Payment is due within 30 days. Thank you for choosing our services. For any questions regarding this invoice, please contact our billing department.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
