'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'

// Component Imports
import AdminFAQTable from './AdminFAQTable'
import AddAdminFAQDrawer from './AddAdminFAQDrawer'
import EditAdminFAQDrawer from './EditAdminFAQDrawer'

// Utils Imports
import { toast } from '@/utils/toast'

const AdminFAQ = () => {
  // States
  const [searchValue, setSearchValue] = useState('')
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [faqData, setFaqData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch FAQ data
  const fetchFAQData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/faq')
      const data = await response.json()

      if (response.ok) {
        setFaqData(data.faqs || [])
      } else {
        toast.error(data.error || 'Failed to fetch FAQ data')
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error)
      toast.error('Failed to fetch FAQ data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQData()
  }, [])

  // Handle edit FAQ
  const handleEdit = (faq) => {
    setEditData(faq)
    setEditDrawerOpen(true)
  }

  // Handle delete FAQ
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/faq/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('FAQ deleted successfully')
        fetchFAQData()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete FAQ')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ')
    }
  }

  // Filter FAQ data based on search
  const filteredData = faqData.filter(faq =>
    faq.title?.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title="Admin FAQ"
            action={
              <Button
                variant='contained'
                startIcon={<i className='ri-add-line' />}
                onClick={() => setAddDrawerOpen(true)}
              >
                Add Admin FAQ
              </Button>
            }
          />
          <div className='p-6'>
            <div className='flex justify-between items-center gap-4 mb-6'>
              <TextField
                size='small'
                placeholder='Start typing to search...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='is-full max-is-[300px]'
                InputProps={{
                  startAdornment: <i className='ri-search-line text-textSecondary' />
                }}
              />
            </div>

            <AdminFAQTable
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </Card>
      </Grid>

      {/* Add FAQ Drawer */}
      <AddAdminFAQDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onSuccess={fetchFAQData}
      />

      {/* Edit FAQ Drawer */}
      <EditAdminFAQDrawer
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false)
          setEditData(null)
        }}
        onSuccess={fetchFAQData}
        editData={editData}
      />
    </Grid>
  )
}

export default AdminFAQ