'use client'

// React Imports
import React, { useState, useEffect, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'
import Avatar from '@mui/material/Avatar'

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
import ActionBtn from '@/components/ActionBtn'
import Link from '@components/Link'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from '@/utils/toast'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const SuperAdminListTable = ({ refreshTrigger, onRefresh, onEdit, onView, onAdd }) => {
  // States
  const [superAdmins, setSuperAdmins] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch super admins
  const fetchSuperAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/super-admins')
      if (response.ok) {
        const data = await response.json()
        setSuperAdmins(data)
        setFilteredData(data)
      }
    } catch (error) {
      console.error('Error fetching super admins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuperAdmins()
  }, [refreshTrigger])

  useEffect(() => {
    setFilteredData(superAdmins)
  }, [superAdmins])

  // Handle super admin deletion
  const handleDelete = async (superAdminId) => {
    if (window.confirm('Are you sure you want to delete this super admin? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/super-admins/${superAdminId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setSuperAdmins(prevData => prevData.filter(admin => admin.id !== superAdminId))
          setFilteredData(prevData => prevData.filter(admin => admin.id !== superAdminId))
          toast.success('Super admin deleted successfully!')
        } else {
          toast.error('Failed to delete super admin. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting super admin:', error)
        toast.error('An error occurred while deleting the super admin.')
      }
    }
  }

  const columns = useMemo(
    () => [
      // Serial Number column
      columnHelper.accessor('serialNumber', {
        header: 'S. No.',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
        enableSorting: false,
        size: 80,
        minSize: 60,
        maxSize: 100
      }),
      columnHelper.accessor('firstName', {
        header: 'Name',
        cell: ({ row }) => {
          const fullName = `${row.original.firstName} ${row.original.lastName}`.trim()
          return (
            <div className='flex items-center gap-4'>
              <Avatar
                src={row.original.image}
                size={34}
              >
                {getInitials(fullName)}
              </Avatar>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {fullName}
                </Typography>
              </div>
            </div>
          )
        },
        size: 180,
        minSize: 150,
        maxSize: 220
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.email?.toLowerCase()}
          </Typography>
        ),
        size: 200,
        minSize: 180,
        maxSize: 250
      }),
      columnHelper.accessor('role', {
        header: 'User Role',
        cell: ({ row }) => (
          <Chip
            label='Super Admin'
            color='primary'
            size='small'
            variant='tonal'
          />
        ),
        size: 120,
        minSize: 100,
        maxSize: 150
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label='Active'
            color='success'
            size='small'
            variant='tonal'
          />
        ),
        size: 100,
        minSize: 80,
        maxSize: 120
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center justify-end'>
            <ActionBtn
              mainButtonText="View"
              mainButtonIcon="ri-eye-line"
              mainButtonAction={() => onView && onView(row.original)}
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    onClick: () => onEdit && onEdit(row.original),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: () => handleDelete(row.original.id),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 100,
        minSize: 80,
        maxSize: 120
      })
    ],
    [locale, onEdit, onView]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
        <Button
          variant='contained'
          startIcon={<i className='ri-add-line' />}
          onClick={() => onAdd && onAdd()}
          className='max-sm:is-full'
        >
          Add Super Admin
        </Button>
        <div className='flex items-center flex-col sm:flex-row max-sm:is-full gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Super Admin'
            className='max-sm:is-full min-is-[250px]'
          />
        </div>
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} style={{ width: header.getSize(), textTransform: 'uppercase' }}>
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
                        <td key={cell.id} style={{ width: cell.column.getSize() }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
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
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default SuperAdminListTable