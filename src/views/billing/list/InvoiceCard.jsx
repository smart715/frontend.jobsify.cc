'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

const InvoiceCard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    invoices: 0,
    paid: 0,
    unpaid: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [invoicesResponse, clientsResponse] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/clients')
        ])

        const invoices = invoicesResponse.ok ? await invoicesResponse.json() : []
        const clients = clientsResponse.ok ? await clientsResponse.json() : []

        // Calculate statistics
        const totalInvoices = invoices.length
        const totalClients = clients.length
        const paidAmount = invoices
          .filter(invoice => invoice.status === 'PAID')
          .reduce((sum, invoice) => sum + (invoice.amount || 0), 0)
        const unpaidAmount = invoices
          .filter(invoice => invoice.status !== 'PAID')
          .reduce((sum, invoice) => sum + (invoice.unpaidAmount || invoice.amount || 0), 0)

        setStats({
          clients: totalClients,
          invoices: totalInvoices,
          paid: paidAmount,
          unpaid: unpaidAmount
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}k`
    }
    return `$${amount.toFixed(0)}`
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <HorizontalWithSubtitle
          title={loading ? '...' : stats.clients.toString()}
          subtitle='Clients'
          avatarIcon='ri-user-line'
          avatarColor='primary'
          stats={loading ? '...' : stats.clients.toString()}
          trendNumber='10%'
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <HorizontalWithSubtitle
          title={loading ? '...' : stats.invoices.toString()}
          subtitle='Invoices'
          avatarIcon='ri-file-copy-line'
          avatarColor='success'
          stats={loading ? '...' : stats.invoices.toString()}
          trendNumber='12%'
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <HorizontalWithSubtitle
          title={loading ? '...' : formatCurrency(stats.paid)}
          subtitle='Paid'
          avatarIcon='ri-file-check-line'
          avatarColor='info'
          stats={loading ? '...' : formatCurrency(stats.paid)}
          trendNumber='22%'
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <HorizontalWithSubtitle
          title={loading ? '...' : formatCurrency(stats.unpaid)}
          subtitle='Unpaid'
          avatarIcon='ri-file-list-line'
          avatarColor='warning'
          stats={loading ? '...' : formatCurrency(stats.unpaid)}
          trendNumber='8%'
          trend='negative'
        />
      </Grid>
    </Grid>
  )
}

export default InvoiceCard