'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/material/styles'

// Next Imports
import Link from 'next/link'

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
  getSortedRowModel,
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Styled Components
const StyledTable = styled('table')(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  '& .table-header': {
    backgroundColor: theme.palette.customColors.tableHeaderBg,
  },
}))

// Column Definitions
const columnHelper = createColumnHelper()

const InvoiceListTable = ({ invoiceData: initialData = [] }) => {
  // States
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      if (initialData.length === 0) {
        setLoading(true)
        try {
          const response = await fetch('/api/invoices')
          if (response.ok) {
            const invoices = await response.json()
            setData(invoices)
          }
        } catch (error) {
          console.error('Error fetching invoices:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchInvoices()
  }, [initialData])

  const columns = useMemo(
    () => [
      {
        id: 'serialNumber',
        header: 'S.No.',
        cell: ({ row }) => (
          <Typography color="text.primary" className="font-medium">
            {row.index + 1}
          </Typography>
        ),
        enableSorting: false,
      },
      columnHelper.accessor('invoiceId', {
        header: '#',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={`/billing/invoice/view/${row.original.id}`}
            color="primary"
          >
            {row.original.invoiceId || `#${row.original.id}`}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status
          let color = 'default'
          let icon = 'ri-circle-fill'

          switch (status) {
            case 'PAID':
              color = 'success'
              break
            case 'PENDING':
              color = 'warning'
              break
            case 'DRAFT':
              color = 'secondary'
              break
            case 'OVERDUE':
              color = 'error'
              break
            default:
              color = 'default'
          }

          return (
            <div className="flex items-center gap-3">
              <i className={classnames(icon, 'text-xs', `text-${color}`)} />
              <Typography color="text.primary">{status}</Typography>
            </div>
          )
        },
      }),
      columnHelper.accessor('companyName', {
        header: 'Company',
        cell: ({ row }) => {
          const companyData = row.original.company || {}
          return (
            <div className="flex items-center gap-3">
              <Avatar src={companyData.companyLogo || ''} size={34}>
                {companyData.companyName?.charAt(0) || 'C'}
              </Avatar>
              <div className="flex flex-col">
                <Typography color="text.primary" className="font-medium">
                  {companyData.companyName || 'Unknown Company'}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {companyData.companyEmail || ''}
                </Typography>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('amount', {
        header: 'Total',
        cell: ({ row }) => <Typography>${row.original.amount || 0}</Typography>,
      }),
      columnHelper.accessor('issueDate', {
        header: 'Issued Date',
        cell: ({ row }) => {
          const date = row.original.issueDate || row.original.createdAt
          return (
            <Typography>
              {date ? new Date(date).toLocaleDateString() : '-'}
            </Typography>
          )
        },
      }),
      columnHelper.accessor('unpaidAmount', {
        header: 'Balance',
        cell: ({ row }) => {
          const unpaidAmount = row.original.unpaidAmount || 0
          return unpaidAmount === 0 ? (
            <Chip label="Paid" variant="tonal" size="small" color="success" />
          ) : (
            <Typography>${unpaidAmount}</Typography>
          )
        },
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <IconButton
            onClick={(e) => handleMenuOpen(e, row.original)}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.04)',
              },
            }}
          >
            <i className="ri-more-2-line" style={{ fontSize: '18px' }} />
          </IconButton>
        ),
        enableSorting: false,
      },
    ],
    [data]
  )

  const handleDelete = async (invoiceId) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setData((prev) => prev.filter((invoice) => invoice.id !== invoiceId))
        }
      } catch (error) {
        console.error('Error deleting invoice:', error)
      }
    }
  }

  const handleDownload = (invoiceId) => {
    // Implement download functionality here
    console.log('Downloading invoice:', invoiceId)
    // You can add actual download logic here
    setAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedInvoice(null)
  }

  const handleMenuOpen = (event, invoice) => {
    setAnchorEl(event.currentTarget)
    setSelectedInvoice(invoice)
  }

  const handleView = () => {
    if (selectedInvoice) {
      window.open(`/billing/invoice/view/${selectedInvoice.id}`, '_blank')
    }
    handleMenuClose()
  }

  const handleDownloadAction = () => {
    if (selectedInvoice) {
      handleDownload(selectedInvoice.id)
    }
    handleMenuClose()
  }

  const handleDeleteAction = () => {
    if (selectedInvoice) {
      handleDelete(selectedInvoice.id)
    }
    handleMenuClose()
  }

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  if (loading) {
    return (
      <Card>
        <CardHeader title="Invoice List" className="pbe-4" />
        <div className="flex justify-center p-5">
          <Typography>Loading invoices...</Typography>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader title="Invoice List" className="pbe-4" />
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-5 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="is-[70px]"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </CustomTextField>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Invoice"
            className="is-full sm:is-auto"
          />
        </div>
        <div className="overflow-x-auto">
          <StyledTable className={tableStyles.table}>
            <thead className="table-header">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
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
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
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
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => {
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
          </StyledTable>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          className="border-bs"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minWidth: '160px',
          },
        }}
      >
        <MenuItem
          onClick={handleView}
          sx={{
            py: 1.5,
            px: 2,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
            },
          }}
        >
          <i
            className="ri-eye-outline"
            style={{ marginRight: '12px', fontSize: '16px', color: '#6B7280' }}
          />
          View
        </MenuItem>
        <MenuItem
          onClick={handleDownloadAction}
          sx={{
            py: 1.5,
            px: 2,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
            },
          }}
        >
          <i
            className="ri-download-line"
            style={{ marginRight: '12px', fontSize: '16px', color: '#6B7280' }}
          />
          Download
        </MenuItem>
        <MenuItem
          onClick={handleDeleteAction}
          sx={{
            py: 1.5,
            px: 2,
            fontSize: '0.875rem',
            color: '#EF4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
              color: '#EF4444',
            },
          }}
        >
          <i
            className="ri-delete-bin-7-line"
            style={{ marginRight: '12px', fontSize: '16px', color: '#EF4444' }}
          />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

// Debounced Input
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default InvoiceListTable