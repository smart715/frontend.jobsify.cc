'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardHeader,
  Checkbox,
  IconButton,
  TablePagination,
  Typography,
  Chip,
  Avatar,
  Box,
  Skeleton,
} from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import ActionBtn from '@/components/ActionBtn'

import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const AppreciationListTable = ({ appreciationData, onEditClick, onDeleteClick, loading, onRefresh }) => {

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
      columnHelper.accessor('givenTo', {
        header: 'Given To',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar 
              src={row.original.employeeAvatar} 
              sx={{ width: 34, height: 34 }}
            >
              {row.original.givenTo?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.givenTo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {row.original.designation}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('award', {
        header: 'Award Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: row.original.awardColor || '#4CAF50' }}
            />
            <Typography color="text.primary" className="font-medium">
              {row.original.award}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('givenOn', {
        header: 'Given On',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {new Date(row.original.givenOn).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })}
          </Typography>
        )
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
                      console.log('View appreciation:', row.original)
                    }
                  },
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => onEditClick(row.original)
                  },
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => onDeleteClick(row.original)
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
      })
    ],
    [onEditClick, onDeleteClick]
  )

  const table = useReactTable({
    data: appreciationData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <Card>
        <CardHeader title="Loading..." />
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>
                    <Skeleton variant="text" width={100} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
            {loading ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    Loading...
                  </td>
                </tr>
              </tbody>
            ) : table.getRowModel().rows?.length === 0 ? (
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

export default AppreciationListTable