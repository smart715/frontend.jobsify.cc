
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'

// Styled Components
const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& th, & td': {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    textAlign: 'left'
  },
  '& th': {
    fontWeight: 600,
    color: theme.palette.text.primary
  }
}))

const InvoiceListTable = () => {
  const invoices = [
    {
      id: '#INV-001',
      date: '01 Dec 2023',
      amount: '$129.00',
      status: 'Paid'
    },
    {
      id: '#INV-002',
      date: '01 Nov 2023',
      amount: '$129.00',
      status: 'Paid'
    },
    {
      id: '#INV-003',
      date: '01 Oct 2023',
      amount: '$129.00',
      status: 'Pending'
    }
  ]

  return (
    <Card>
      <CardHeader title='Invoice History' />
      <div className='overflow-x-auto'>
        <StyledTable>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>
                  <Typography color='text.primary'>{invoice.id}</Typography>
                </td>
                <td>
                  <Typography color='text.primary'>{invoice.date}</Typography>
                </td>
                <td>
                  <Typography color='text.primary'>{invoice.amount}</Typography>
                </td>
                <td>
                  <Chip
                    label={invoice.status}
                    size='small'
                    color={invoice.status === 'Paid' ? 'success' : 'warning'}
                    variant='tonal'
                  />
                </td>
                <td>
                  <Button size='small' variant='outlined'>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    </Card>
  )
}

export default InvoiceListTable
