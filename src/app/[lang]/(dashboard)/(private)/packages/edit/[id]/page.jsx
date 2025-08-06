
'use client'

import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import EditPackage from '@views/packages/edit'

const PackageEditPage = () => {
  const router = useRouter()
  const params = useParams()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPackageData(data)
        } else {
          console.error('Failed to fetch package')
          router.push('/packages')
        }
      } catch (error) {
        console.error('Error fetching package:', error)
        router.push('/packages')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPackage()
    }
  }, [params.id, router])

  const handleSubmitPackage = async (formData) => {
    try {
      const response = await fetch(`/api/packages/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/packages')
      } else {
        console.error('Failed to update package:', await response.text())
      }
    } catch (error) {
      console.error('Error updating package:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!packageData) {
    return <div>Package not found</div>
  }

  return <EditPackage onSubmit={handleSubmitPackage} packageData={packageData} />
}

export default PackageEditPage
