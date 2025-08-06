
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
import DepartmentListTable from './DepartmentListTable'
import AddDepartmentDrawer from './AddDepartmentDrawer'
import EditDepartmentDrawer from './EditDepartmentDrawer'
import DeleteDepartmentDialog from './DeleteDepartmentDialog'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'

const DepartmentList = ({ dictionary }) => {
  // States
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  
  // Pagination states
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Drawer states
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false)
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false)
  const [deleteDepartmentOpen, setDeleteDepartmentOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      } else {
        console.error('Failed to fetch departments')
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    return departments.filter(department =>
      department.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [departments, searchValue])

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredDepartments.slice(startIndex, endIndex)
  }, [filteredDepartments, page, rowsPerPage])

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle edit department
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department)
    setEditDepartmentOpen(true)
  }

  // Handle delete department
  const handleDeleteDepartment = (department) => {
    setSelectedDepartment(department)
    setDeleteDepartmentOpen(true)
  }

  // Handle close edit drawer
  const handleCloseEditDrawer = () => {
    setEditDepartmentOpen(false)
    setSelectedDepartment(null)
  }

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDepartmentOpen(false)
    setSelectedDepartment(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title={dictionary?.navigation?.department || 'Departments'}
            action={
              <div className='flex items-center gap-4'>
                <TextField
                  size='small'
                  placeholder='Search Department'
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
                  onClick={() => setAddDepartmentOpen(true)}
                  className='is-full sm:is-auto'
                >
                  Add Department
                </Button>
              </div>
            }
          />
          <DepartmentListTable 
            departments={paginatedData}
            loading={loading}
            onRefresh={fetchDepartments}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
          />
          <TablePagination
            component='div'
            count={filteredDepartments.length}
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

      {/* Add Department Drawer */}
      <AddDepartmentDrawer
        open={addDepartmentOpen}
        handleClose={() => setAddDepartmentOpen(false)}
        onSuccess={fetchDepartments}
      />

      {/* Edit Department Drawer */}
      <EditDepartmentDrawer
        open={editDepartmentOpen}
        handleClose={handleCloseEditDrawer}
        department={selectedDepartment}
        onSuccess={fetchDepartments}
      />

      {/* Delete Department Dialog */}
      <DeleteDepartmentDialog
        open={deleteDepartmentOpen}
        handleClose={handleCloseDeleteDialog}
        department={selectedDepartment}
        onSuccess={fetchDepartments}
      />
    </Grid>
  )
}

export default DepartmentList
