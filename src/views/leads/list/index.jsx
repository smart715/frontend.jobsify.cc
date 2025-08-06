
'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, Button, TextField, Grid, TablePagination } from '@mui/material'
import { toast } from 'react-toastify'

import LeadListTable from './LeadListTable'
import AddLeadDrawer from './AddLeadDrawer'
import TableFilters from './TableFilters'

const LeadsList = ({ dictionary }) => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [addLeadOpen, setAddLeadOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleAddLead = async (leadData) => {
    try {
      // Add companyId - you might want to get this from session or context
      const leadDataWithCompany = {
        ...leadData,
        companyId: 'default-company-id' // Replace with actual company ID from session
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadDataWithCompany)
      })

      if (response.ok) {
        const newLead = await response.json()
        setLeads(prev => [newLead, ...prev])
        setAddLeadOpen(false)
        toast.success('Lead added successfully')
      } else {
        toast.error('Failed to add lead')
      }
    } catch (error) {
      console.error('Error adding lead:', error)
      toast.error('Error adding lead')
    }
  }

  const handleEditLead = async (leadId, updatedData) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        const updatedLead = await response.json()
        setLeads(prev => prev.map(lead => lead.id === leadId ? updatedLead : lead))
        toast.success('Lead updated successfully')
      } else {
        toast.error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      toast.error('Error updating lead')
    }
  }

  const handleDeleteLead = async (leadId) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId))
        toast.success('Lead deleted successfully')
      } else {
        toast.error('Failed to delete lead')
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      toast.error('Error deleting lead')
    }
  }

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.contactName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchValue.toLowerCase())
    
    const matchesType = filterType === 'all' || lead.leadSource === filterType
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Paginate data
  const paginatedData = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title="Lead Contacts"
            action={
              <div className='flex items-center gap-4'>
                <TextField
                  size='small'
                  placeholder='Start typing to search...'
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className='is-[250px]'
                  InputProps={{
                    startAdornment: <i className='ri-search-line' />
                  }}
                />
                <Button
                  variant='contained'
                  startIcon={<i className='ri-add-line' />}
                  onClick={() => setAddLeadOpen(true)}
                  className='is-full sm:is-auto'
                >
                  Add Lead Contact
                </Button>
              </div>
            }
          />
          <TableFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <LeadListTable 
            leads={paginatedData}
            loading={loading}
            onRefresh={fetchLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
          />
          <TablePagination
            component='div'
            count={filteredLeads.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </Grid>

      <AddLeadDrawer
        open={addLeadOpen}
        handleClose={() => setAddLeadOpen(false)}
        onSubmit={handleAddLead}
        dictionary={dictionary}
      />
    </Grid>
  )
}

export default LeadsList
