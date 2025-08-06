
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'

const AdminFAQTable = ({ data, onEdit, onDelete, loading }) => {
  // States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFaq, setSelectedFaq] = useState(null)

  // Handle menu
  const handleMenuClick = (event, faq) => {
    setAnchorEl(event.currentTarget)
    setSelectedFaq(faq)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFaq(null)
  }

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Paginated data
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) {
    return (
      <div className='flex justify-center items-center py-10'>
        <CircularProgress />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-10'>
            <i className='ri-file-list-3-line text-6xl text-textSecondary mb-4' />
            <Typography variant='h6' className='mb-2'>No FAQ found</Typography>
            <Typography color='textSecondary'>
              No records found matching your search criteria.
            </Typography>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='min-w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 font-medium text-textSecondary'>#</th>
              <th className='text-left py-3 px-4 font-medium text-textSecondary'>Article Heading</th>
              <th className='text-left py-3 px-4 font-medium text-textSecondary'>Article Category</th>
              <th className='text-left py-3 px-4 font-medium text-textSecondary'>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((faq, index) => (
              <tr key={faq.id} className='border-b border-gray-100 hover:bg-gray-50'>
                <td className='py-4 px-4'>
                  <Typography variant='body2'>
                    {page * rowsPerPage + index + 1}
                  </Typography>
                </td>
                <td className='py-4 px-4'>
                  <Typography variant='body2' className='font-medium'>
                    {faq.title}
                  </Typography>
                </td>
                <td className='py-4 px-4'>
                  <Chip
                    label={faq.category || 'Uncategorized'}
                    size='small'
                    variant='tonal'
                    color='primary'
                  />
                </td>
                <td className='py-4 px-4'>
                  <Tooltip title='More Actions'>
                    <IconButton
                      size='small'
                      onClick={(e) => handleMenuClick(e, faq)}
                    >
                      <i className='ri-more-2-line' />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            onEdit(selectedFaq)
            handleMenuClose()
          }}
        >
          <i className='ri-edit-box-line mr-2' />
          Edit
        </MenuItem>
        <Divider />
        <OpenDialogOnElementClick
          element={MenuItem}
          elementProps={{ className: 'text-red-500' }}
          dialog={ConfirmationDialog}
          dialogProps={{
            type: 'delete-faq',
            name: selectedFaq?.title
          }}
          onConfirm={() => {
            onDelete(selectedFaq.id)
            handleMenuClose()
          }}
        >
          <i className='ri-delete-bin-7-line mr-2' />
          Delete
        </OpenDialogOnElementClick>
      </Menu>
    </>
  )
}

export default AdminFAQTable
