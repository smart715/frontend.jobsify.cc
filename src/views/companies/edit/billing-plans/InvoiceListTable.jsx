'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
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

// Utils
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const InvoiceListTable = () => {
  const params = useParams()
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [params.id])

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`/api/invoices?companyId=${params.id}`)
      if (response.ok) {
        const invoices = await response.json()
        setData(invoices)
        setFilteredData(invoices)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'unpaid':
        return 'error'
      default:
        return 'default'
    }
  }

  const columns = [
    columnHelper.accessor('invoiceId', {
      header: '#',
      cell: ({ row }) => (
        <Typography
          component="span"
          color="primary"
          className="font-medium hover:text-primary cursor-pointer"
        >
          #{row.original.invoiceId}
        </Typography>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Chip
            variant="tonal"
            label={row.original.status}
            color={getStatusColor(row.original.status)}
            size="small"
          />
        </div>
      )
    }),
    columnHelper.accessor('amount', {
      header: 'Total',
      cell: ({ row }) => (
        <Typography className="font-medium text-textPrimary">
          ${row.original.amount}
        </Typography>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Issued Date',
      cell: ({ row }) => (
        <Typography>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </Typography>
      )
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: ({ row }) => (
        <Typography>
          {row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : 'N/A'}
        </Typography>
      )
    }),
    columnHelper.accessor('unpaidAmount', {
      header: 'Balance',
      cell: ({ row }) => (
        <Typography className={row.original.unpaidAmount > 0 ? 'text-error' : 'text-success'}>
          ${row.original.unpaidAmount || 0}
        </Typography>
      )
    }),
  ]

  const table = useReactTable({
    data: filteredData,
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

  if (loading) {
    return (
      <Card>
        <CardHeader title="Invoices" />
        <Typography sx={{ p: 3 }}>Loading invoices...</Typography>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Invoices"
        />
        <div className="overflow-x-auto">
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
                            asc: <i className="ri-arrow-up-s-line text-xl" />,
                            desc: <i className="ri-arrow-down-s-line text-xl" />
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
                  <td colSpan={table.getVisibleFlatColumns().length} className="text-center">
                    No invoices found
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
          component="div"
          className="border-bs"
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
    </>
  )
}

export default InvoiceListTable