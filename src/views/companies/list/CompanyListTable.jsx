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
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'

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
import { useSession, updateSession } from 'next-auth/react'

// Component Imports
import ActionBtn from '@/components/ActionBtn'
import DeleteCompanyDialog from './DeleteCompanyDialog'
import Link from '@components/Link'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from '@/utils/toast'

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
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
    />
  )
}

// Column Definitions
const columnHelper = createColumnHelper()

const CompanyListTable = ({ companyData }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(companyData || [])
  const [filteredData, setFilteredData] = useState(companyData || [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState(null)
  const [impersonationDialogOpen, setImpersonationDialogOpen] = useState(false)
  const [companyToImpersonate, setCompanyToImpersonate] = useState(null)

  // Hooks
  const { lang: locale } = useParams()
  const { data: session, update } = useSession()

  useEffect(() => {
    const initialData = companyData || []

    setData(initialData)
    setFilteredData(initialData)
  }, [companyData])

  const columns = useMemo(
    () => [
      // Serial Number column
      columnHelper.accessor('serialNumber', {
        header: 'S. No.',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
        enableSorting: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
      }),
      /* REMOVE CHECKBOX COLUMN
      {
        id: 'select',
        header: ({ table }) => (
          <div className='ml-8'>
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        ),
        size: 50,
        minSize: 40,
        maxSize: 60
      },
      */

      columnHelper.accessor('companyId', {
        header: 'Company ID',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.companyId}</Typography>
        ),
        size: 140,
        minSize: 120,
        maxSize: 160,
      }),
      columnHelper.accessor('companyName', {
        header: 'Company Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {row.original.companyName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textTransform: 'lowercase' }}
              >
                {row.original.companyEmail
                  ? row.original.companyEmail.toLowerCase()
                  : 'No email provided'}
              </Typography>
            </div>
          </div>
        ),
        size: 150,
        minSize: 120,
        maxSize: 200,
      }),
      columnHelper.accessor('companyPhone', {
        header: 'Company Phone',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.companyPhone || '-'}
          </Typography>
        ),
        size: 130,
        minSize: 110,
        maxSize: 160,
      }),
      columnHelper.accessor('package', {
        header: 'Package',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.packageName || '-'}
          </Typography>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status || 'Unknown'}
            color={
              row.original.status === 'Active'
                ? 'success'
                : row.original.status === 'Inactive'
                  ? 'error'
                  : 'default'
            }
            variant="tonal"
            size="small"
          />
        ),
        size: 100,
        minSize: 80,
        maxSize: 120,
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            {' '}
            {/* Align action buttons to the right */}
            <ActionBtn
              href={getLocalizedUrl(
                `/companies/edit/${row.original.id}`,
                locale
              )} // Main button action
              mainButtonText="View"
              mainButtonIcon="ri-eye-line"
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: getLocalizedUrl(
                    `/companies/edit/${row.original.id}`,
                    locale
                  ),
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                  },
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: () => handleDelete(row.original.id),
                    className: 'flex items-center gap-2 text-textSecondary',
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
    [locale, setData] // Updated dependency array
  )

  const table = useReactTable({
    data: filteredData, // Use filteredData which is derived from companyData
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true, //enable row selection for all rows
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  // Handle company deletion
  const handleDelete = async (companyId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this company? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(`/api/companies/${companyId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setData((prevData) =>
            prevData.filter((company) => company.id !== companyId)
          )
          setFilteredData((prevData) =>
            prevData.filter((company) => company.id !== companyId)
          )
          toast.success('Company deleted successfully!')
        } else {
          toast.error('Failed to delete company. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting company:', error)
        toast.error('An error occurred while deleting the company.')
      }
    }
  }

  // Handle company login (impersonation)
  const handleImpersonationClick = (company) => {
    setCompanyToImpersonate(company)
    setImpersonationDialogOpen(true)
  }

  // Handle company impersonation
  const handleImpersonation = async (company) => {
    console.log('🔄 Starting impersonation for company:', {
      companyName: company.companyName,
      companyId: company.companyId
    })

    try {
      const response = await fetch('/api/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId: company.companyId,
          type: 'company'
        })
      })

      const data = await response.json()
      console.log('📡 Impersonation API response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start impersonation')
      }

      console.log('✅ Impersonation successful for:', data.impersonationData?.companyName)
      toast.success(`Successfully logged in as ${company.companyName}`)

      // Force session refresh by updating the session
      await update()

      // Small delay to ensure session is updated
      setTimeout(() => {
        // Redirect ADMIN users to CRM dashboard, others to default dashboard
        const redirectPath = data.impersonationData?.role === 'ADMIN' 
          ? '/en/dashboards/crm' 
          : '/en/dashboards/dashboard'
        window.location.replace(redirectPath)
      }, 500)

    } catch (error) {
      console.error('❌ Error in impersonation:', error)
      toast.error(
        error.message || 'An error occurred while trying to login as company.'
      )
    }
  }

  // Handle company download (placeholder function)
  const handleDownload = (companyId) => {
    // Implement download functionality here
    console.log('Download company:', companyId)
    toast.info('Download functionality will be implemented')
  }

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDeleteDialogOpen = (company) => {
    setCompanyToDelete(company)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setCompanyToDelete(null)
  }

  const handleImpersonationDialogClose = () => {
    setImpersonationDialogOpen(false)
    setCompanyToImpersonate(null)
  }

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return

    try {
      const response = await fetch(`/api/companies/${companyToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((company) => company.id !== companyToDelete.id)
        )
        setFilteredData((prevData) =>
          prevData.filter((company) => company.id !== companyToDelete.id)
        )
        toast.success('Company deleted successfully!')
      } else {
        toast.error('Failed to delete company. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error('An error occurred while deleting the company.')
    } finally {
      handleDeleteDialogClose() // Close the dialog in either case
    }
  }

  return (
    <Card>
      <CardContent className="flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
        <Button
          variant="contained"
          component={Link}
          startIcon={<i className="ri-add-line" />}
          href={getLocalizedUrl('companies/add', locale)}
          className="max-sm:is-full"
        >
          Create Company
        </Button>
        <div className="flex items-center flex-col sm:flex-row max-sm:is-full gap-4">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Company" // Changed placeholder
            className="max-sm:is-full min-is-[250px]"
          />
          {/* Removed FormControl for Invoice Status filter */}
        </div>
      </CardContent>
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
                          desc: <i className="ri-arrow-down-s-line text-xl" />,
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
                    <React.Fragment key={row.id}>
                      <tr
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <td
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                          >
                            {index === 0 ? (
                              <div className="flex items-center">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    toggleRowExpansion(row.original.id)
                                  }
                                >
                                  <i
                                    className={`ri-${expandedRows[row.original.id] ? 'arrow-down-s-line' : 'arrow-right-s-line'}`}
                                  />
                                </IconButton>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </td>
                        ))}
                      </tr>

                      {expandedRows[row.original.id] && (
                        <tr>
                          <td></td>
                          <td
                            colSpan={row.getVisibleCells().length - 2}
                            className="bg-muted p-4 text-sm"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex justify-center items-center">
                              <div className="flex justify-center items-center gap-2">
                                <Typography variant="body2">
                                  Registered Date:
                                </Typography>
                                <Typography variant="subtitle">
                                  {row.original.registeredDate || 'N/A'}
                                </Typography>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Typography variant="body2">Staff:</Typography>
                                <Typography variant="subtitle">
                                  {row.original.staff || '0/0'}
                                </Typography>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Typography variant="body2">
                                  Clients:
                                </Typography>
                                <Typography variant="subtitle">
                                  {row.original.clients?.toLocaleString() ||
                                    '0'}
                                </Typography>
                              </div>
                              <div className="flex justify-center items-center gap-2">
                                <Typography variant="body2">
                                  Total Users:
                                </Typography>
                                <Typography variant="subtitle">
                                  {row.original.totalUsers?.toLocaleString() ||
                                    '0'}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </React.Fragment>
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
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      />
      <DeleteCompanyDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        companyData={companyToDelete}
      />
    </Card>
  )
}

export default CompanyListTable