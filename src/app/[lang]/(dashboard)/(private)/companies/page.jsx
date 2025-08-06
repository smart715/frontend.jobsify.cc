// Component Imports
import CompanyList from '@/views/companies/list'

// API Data Fetching
const getCompanyData = async () => {
  // Use absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/companies`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch company data')
  }

  return res.json()
}

const CompanyPage = async () => {
  // Vars
  const data = await getCompanyData()

  return <CompanyList companyData={data} />
}

export default CompanyPage
