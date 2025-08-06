'use client'

// React Imports
import React, { useState, useMemo } from 'react'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
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
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'

// Utils Imports
import { getInitials } from '@/utils/getInitials'
import { getStatusColor } from '@/utils/employeeUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const EmployeeListTable = ({ tableData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  // Handle menu open/close
  const handleClick = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setCurrentEmployee(employee)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCurrentEmployee(null)
  }

  const handleDelete = (employeeId) => {
    setData(prevData => prevData.filter(employee => employee.id !== employeeId))
    handleClose()
  }

  // Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('serialNumber', {
        header: 'S.NO.',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.index + 1}
          </Typography>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('employeeId', {
        header: 'EMPLOYEE ID',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.employeeId}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'EMPLOYEE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' size={34}>
              {getInitials(`${row.original.firstName} ${row.original.lastName}`)}
            </CustomAvatar>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {`${row.original.firstName} ${row.original.lastName || ''}`.trim()}
              </Typography>
              <Typography variant='body2' color='text.disabled'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('department', {
        header: 'DEPARTMENT',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.Department?.name || row.original.department || 'Not assigned'}
          </Typography>
        )
      }),
      columnHelper.accessor('designation', {
        header: 'DESIGNATION',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.Designation?.name || row.original.designation || 'Not assigned'}
          </Typography>
        )
      }),
      columnHelper.accessor('phone', {
        header: 'PHONE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.phone || 'Not provided'}
          </Typography>
        )
      }),
      columnHelper.accessor('dateOfJoining', {
        header: 'JOINING DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.dateOfJoining ? new Date(row.original.dateOfJoining).toLocaleDateString() : 'Not set'}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            color={getStatusColor(row.original.status)}
            variant='outlined'
            size='small'
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={event => handleClick(event, row.original)}>
              <i className='ri-more-vert-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [anchorEl, currentEmployee]
  )

  const table = useReactTable({
    data: data,
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

  return (
    <>
      <Card>
        <TableFilters setData={setData} tableData={tableData} />
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

      {/* Action Menu */}
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleClose}
        >
          <i className='ri-eye-line' />
          View
        </MenuItem>
        <MenuItem
          onClick={handleClose}
        >
          <i className='ri-edit-box-line' />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(currentEmployee?.id)}>
          <i className='ri-delete-bin-7-line' />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default EmployeeListTable