
'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table'

// Component Imports
import ActionBtn from '@/components/ActionBtn'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Utils
import { getLeadStatusColor } from '@/utils/leadUtils'

// Column Definitions
const columnHelper = createColumnHelper()

const LeadListTable = ({ leads, loading, onRefresh, onEdit, onDelete }) => {
  // States
  const [data, setData] = useState(leads || [])

  // Hooks
  const { lang: locale } = useParams()

  // Update data when props change
  useEffect(() => {
    setData(leads || [])
  }, [leads])

  const columns = useMemo(
    () => [
      {
        id: 'serialNumber',
        header: 'S. No.',
        cell: ({ row }) => (
          <Typography className="font-medium" color="text.primary">
            {row.index + 1}
          </Typography>
        ),
        enableSorting: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
      },
      columnHelper.accessor('contactName', {
        header: 'Contact Name',
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {row.original.contactName}
          </Typography>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {row.original.email}
          </Typography>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {row.original.phone || '-'}
          </Typography>
        ),
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {row.original.company || '-'}
          </Typography>
        ),
      }),
      columnHelper.accessor('leadSource', {
        header: 'Lead Source',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {row.original.leadSource || '-'}
          </Typography>
        ),
      }),
      columnHelper.accessor('leadOwner', {
        header: 'Lead Owner',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {row.original.leadOwner || '-'}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip 
            label={row.original.status} 
            color={getLeadStatusColor(row.original.status)} 
            variant="tonal" 
            size="small" 
          />
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created Date',
        cell: ({ row }) => (
          <Typography color="text.secondary" className="font-medium">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Typography>
        ),
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <ActionBtn
              options={[
                {
                  text: 'View',
                  icon: 'ri-eye-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => {
                      // Handle view action
                      console.log('View lead:', row.original)
                    }
                  },
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => onEdit(row.original.id, row.original)
                  },
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => onDelete(row.original.id)
                  },
                },
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 100,
        minSize: 80,
        maxSize: 120,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        textTransform: 'uppercase',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none':
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="ri-arrow-up-s-line text-xl" />,
                            desc: (
                              <i className="ri-arrow-down-s-line text-xl" />
                            ),
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getRowModel().rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
      </Card>
    </>
  )
}

export default LeadListTable
