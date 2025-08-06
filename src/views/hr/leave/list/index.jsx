
'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'

// Component Imports
import LeaveListTable from './LeaveListTable'
import AddLeaveDrawer from './AddLeaveDrawer'
import EditLeaveDrawer from './EditLeaveDrawer'
import DeleteLeaveDialog from './DeleteLeaveDialog'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'

const LeaveList = ({ dictionary }) => {
  // States
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  
  // Pagination states
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Drawer states
  const [addLeaveOpen, setAddLeaveOpen] = useState(false)
  const [editLeaveOpen, setEditLeaveOpen] = useState(false)
  const [deleteLeaveOpen, setDeleteLeaveOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leaves')
      if (response.ok) {
        const data = await response.json()
        setLeaves(data)
      } else {
        console.error('Failed to fetch leaves')
      }
    } catch (error) {
      console.error('Error fetching leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  // Filter leaves based on search
  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave =>
      leave.employee?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchValue.toLowerCase()) ||
      leave.status?.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [leaves, searchValue])

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredLeaves.slice(startIndex, endIndex)
  }, [filteredLeaves, page, rowsPerPage])

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle edit leave
  const handleEditLeave = (leave) => {
    setSelectedLeave(leave)
    setEditLeaveOpen(true)
  }

  // Handle delete leave
  const handleDeleteLeave = (leave) => {
    setSelectedLeave(leave)
    setDeleteLeaveOpen(true)
  }

  // Handle close edit drawer
  const handleCloseEditDrawer = () => {
    setEditLeaveOpen(false)
    setSelectedLeave(null)
  }

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteLeaveOpen(false)
    setSelectedLeave(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title={dictionary?.navigation?.leave || 'Leave Management'}
            action={
              <div className='flex items-center gap-4'>
                <TextField
                  size='small'
                  placeholder='Search Leave'
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
                  onClick={() => setAddLeaveOpen(true)}
                  className='is-full sm:is-auto'
                >
                  New Leave
                </Button>
              </div>
            }
          />
          <LeaveListTable 
            leaves={paginatedData}
            loading={loading}
            onRefresh={fetchLeaves}
            onEdit={handleEditLeave}
            onDelete={handleDeleteLeave}
          />
          <TablePagination
            component='div'
            count={filteredLeaves.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            showFirstButton
            showLastButton
          />
        </Card>
      </Grid>

      {/* Add Leave Drawer */}
      <AddLeaveDrawer
        open={addLeaveOpen}
        handleClose={() => setAddLeaveOpen(false)}
        onSuccess={fetchLeaves}
      />

      {/* Edit Leave Drawer */}
      <EditLeaveDrawer
        open={editLeaveOpen}
        handleClose={handleCloseEditDrawer}
        leave={selectedLeave}
        onSuccess={fetchLeaves}
      />

      {/* Delete Leave Dialog */}
      <DeleteLeaveDialog
        open={deleteLeaveOpen}
        handleClose={handleCloseDeleteDialog}
        leave={selectedLeave}
        onSuccess={fetchLeaves}
      />
    </Grid>
  )
}

export default LeaveList
