'use client' // Ensure this is present if useRouter is used client-side

// Next Imports
import { useRouter } from 'next/navigation' // Or 'next/router' depending on version

import AddPackageAdd from '@views/packages/add'

const PackageAddPage = () => {
  const router = useRouter()

  const handleSubmitPackage = async (formData) => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Handle success, e.g., redirect or show a success message
        router.push('/packages') // Example redirect
      } else {
        // Handle errors, e.g., show an error message
        console.error('Failed to save package:', await response.text())
        
        // You might want to show a user-facing error message here
      }
    } catch (error) {
      console.error('Error submitting package:', error)
      
      // You might want to show a user-facing error message here
    }
  }

  return <AddPackageAdd onSubmit={handleSubmitPackage} />
}

export default PackageAddPage
