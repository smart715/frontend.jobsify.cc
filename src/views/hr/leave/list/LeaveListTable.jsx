
'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

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

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper()

const LeaveListTable = ({ leaves = [], loading, onRefresh, onEdit, onDelete }) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('employee', {
        header: 'EMPLOYEE',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Avatar skin='light' color='primary'>
              {getInitials(row.original.employee?.name || 'NA')}
            </Avatar>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.employee?.name || 'N/A'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {row.original.employee?.email || ''}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('leaveDate', {
        header: 'LEAVE DATE',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.leaveDate ? new Date(row.original.leaveDate).toLocaleDateString() : 'N/A'}
          </Typography>
        )
      }),
      columnHelper.accessor('duration', {
        header: 'DURATION',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.duration || 'Full Day'}
          </Typography>
        )
      }),
      columnHelper.accessor('leaveType', {
        header: 'LEAVE TYPE',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.leaveType || 'General'}
            color='info'
            size='small'
          />
        )
      }),
      columnHelper.accessor('status', {
        header: 'LEAVE STATUS',
        cell: ({ row }) => {
          const status = row.original.status || 'Pending'
          let color = 'warning'
          
          if (status === 'Approved') color = 'success'
          else if (status === 'Rejected') color = 'error'
          
          return (
            <Chip
              variant='tonal'
              label={status}
              color={color}
              size='small'
            />
          )
        }
      }),
      columnHelper.accessor('paid', {
        header: 'PAID',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.paid ? 'Paid' : 'Unpaid'}
            color={row.original.paid ? 'success' : 'secondary'}
            size='small'
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'ACTION',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <ActionBtn
              mainButtonText="Edit"
              mainButtonAction={() => onEdit(row.original)}
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    onClick: () => onEdit(row.original),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: () => onDelete(row.original),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [onEdit, onDelete]
  )

  const table = useReactTable({
    data: leaves,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter: ''
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loading) {
    return (
      <CardContent>
        <Typography>Loading leaves...</Typography>
      </CardContent>
    )
  }

  return (
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
                No leaves found
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {table.getRowModel().rows.map(row => {
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
  )
}

export default LeaveListTable
