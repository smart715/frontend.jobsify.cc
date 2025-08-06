
// React Imports
import { notFound } from 'next/navigation'

// Component Imports
import InvoicePreview from '@views/billing/invoice/view'

// Server Action Imports
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getInvoiceData = async (id) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        // Try to get company data from companyId
        company: {
          select: {
            id: true,
            companyName: true,
            companyEmail: true,
            companyPhone: true,
            companyAddress: true,
            city: true,
            state: true,
            zipcode: true
          }
        }
      }
    })
    
    return invoice
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return null
  }
}

const InvoicePreviewApp = async ({ params }) => {
  // Vars
  const data = await getInvoiceData(params.id)

  if (!data) {
    notFound()
  }

  return <InvoicePreview invoiceData={data} id={params.id} />
}

export default InvoicePreviewApp
