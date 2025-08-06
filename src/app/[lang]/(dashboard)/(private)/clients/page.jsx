
'use client'

// React Imports
import { useEffect, useState } from 'react'

// Component Imports
import ClientsList from '@/views/clients/list'

const ClientsPage = () => {
  const [clientsData, setClientsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          setClientsData(data)
        } else {
          console.error('Failed to fetch clients')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <ClientsList clientsData={clientsData} />
}

export default ClientsPage
