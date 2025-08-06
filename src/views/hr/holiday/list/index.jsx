'use client'

// React Imports
import React from 'react'
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import AddHolidayDrawer from './AddHolidayDrawer'
import EditHolidayDrawer from './EditHolidayDrawer'
import DeleteHolidayDialog from './DeleteHolidayDialog'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import styles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const HolidayList = ({ dictionary }) => {
  // States
  const [addHolidayOpen, setAddHolidayOpen] = useState(false)
  const [editHolidayOpen, setEditHolidayOpen] = useState(false)
  const [deleteHolidayOpen, setDeleteHolidayOpen] = useState(false)
  const [selectedHoliday, setSelectedHoliday] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Fetch holidays from API
  React.useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    try {
      const response = await fetch('/api/holidays')
      if (response.ok) {
        const result = await response.json()
        setData(result.holidays || [])
      } else {
        console.error('Failed to fetch holidays')
      }
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('sno', {
        header: 'S.No.',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.index + 1}
          </Typography>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('name', {
        header: 'Holiday Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.name}
              </Typography>
              <Typography variant='body2' color='text.disabled'>
                {row.original.description}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {new Date(row.original.date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })}
          </Typography>
        )
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.type}
            size='small'
            color={row.original.type === 'Public' ? 'primary' : 'secondary'}
          />
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.status}
            size='small'
            color={row.original.status === 'Active' ? 'success' : 'secondary'}
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => {
          const [anchorEl, setAnchorEl] = useState(null)
          const open = Boolean(anchorEl)

          const handleClick = (event) => {
            setAnchorEl(event.currentTarget)
          }

          const handleClose = () => {
            setAnchorEl(null)
          }

          const handleView = () => {
            // Add view functionality here
            handleClose()
          }

          const handleEdit = () => {
            setSelectedHoliday(row.original)
            setEditHolidayOpen(true)
            handleClose()
          }

          const handleDelete = () => {
            setSelectedHoliday(row.original)
            setDeleteHolidayOpen(true)
            handleClose()
          }

          return (
            <>
              <Button
                variant="outlined"
                size="small"
                endIcon={<i className="ri-arrow-down-s-line" />}
                onClick={handleClick}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'divider',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                View
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'action-button',
                }}
                PaperProps={{
                  sx: {
                    minWidth: 120,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem'
                    }
                  }
                }}
              >
                <MenuItem onClick={handleView} className="flex items-center gap-2">
                  <i className="ri-eye-line text-lg" />
                  View
                </MenuItem>
                <MenuItem onClick={handleEdit} className="flex items-center gap-2">
                  <i className="ri-edit-box-line text-lg" />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} className="flex items-center gap-2">
                  <i className="ri-delete-bin-7-line text-lg" />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )
        },
        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleAddHoliday = async (holidayData) => {
    try {
      const response = await fetch('/api/holidays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holidayData),
      })
      
      if (response.ok) {
        fetchHolidays() // Refresh the list
        setAddHolidayOpen(false)
      } else {
        console.error('Failed to add holiday')
      }
    } catch (error) {
      console.error('Error adding holiday:', error)
    }
  }

  const handleEditHoliday = async (holidayData) => {
    try {
      const response = await fetch(`/api/holidays/${selectedHoliday.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(holidayData),
      })
      
      if (response.ok) {
        fetchHolidays() // Refresh the list
        setEditHolidayOpen(false)
        setSelectedHoliday(null)
      } else {
        console.error('Failed to update holiday')
      }
    } catch (error) {
      console.error('Error updating holiday:', error)
    }
  }

  const handleDeleteHoliday = async () => {
    try {
      const response = await fetch(`/api/holidays/${selectedHoliday.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchHolidays() // Refresh the list
        setDeleteHolidayOpen(false)
        setSelectedHoliday(null)
      } else {
        console.error('Failed to delete holiday')
      }
    } catch (error) {
      console.error('Error deleting holiday:', error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Holiday List' className='pbe-4' />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-5 border-be'>
          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            onClick={() => setAddHolidayOpen(!addHolidayOpen)}
            className='is-full sm:is-auto'
          >
            Add Holiday
          </Button>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Holiday'
              className='is-full sm:is-auto'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddHolidayDrawer
        open={addHolidayOpen}
        handleClose={() => setAddHolidayOpen(!addHolidayOpen)}
        onSubmit={handleAddHoliday}
        dictionary={dictionary}
      />
      <EditHolidayDrawer
        open={editHolidayOpen}
        handleClose={() => setEditHolidayOpen(!editHolidayOpen)}
        onSubmit={handleEditHoliday}
        holidayData={selectedHoliday}
        dictionary={dictionary}
      />
      <DeleteHolidayDialog
        open={deleteHolidayOpen}
        handleClose={() => setDeleteHolidayOpen(!deleteHolidayOpen)}
        onDelete={handleDeleteHoliday}
        holidayName={selectedHoliday?.name}
      />
    </>
  )
}

export default HolidayList