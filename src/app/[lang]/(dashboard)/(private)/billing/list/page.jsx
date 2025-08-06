// Next Imports
import { redirect } from 'next/navigation'

// Component Imports
import InvoiceList from '@views/billing/list'

const getInvoiceData = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/invoices`, {
      cache: 'no-store' // Ensure fresh data
    })

    if (!res.ok) {
      console.error('Failed to fetch invoice data:', res.statusText)
      return []
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching invoice data:', error)
    return []
  }
}

const BillingListPage = async () => {
  // Vars
  const data = await getInvoiceData()

  return <InvoiceList invoiceData={data} />
}

export default BillingListPage