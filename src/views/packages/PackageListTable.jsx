'use client'

// React Imports
import React, { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
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
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid2'

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
// import CustomAvatar from '@core/components/mui/Avatar' // Removed as it's not used
import ActionBtn from '@/components/ActionBtn'
import DeletePackageDialog from './DeletePackageDialog'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const featureOptions = [
  'Clients',
  'Employees',
  'Projects',
  'Attendance',
  'Tasks',
  'Estimates',
  'Invoices',
  'Payments',
  'Time Logs',
  'Tickets',
  'Events',
  'Notices',
  'Leaves',
  'Leads',
  'Holidays',
  'Products',
  'Expenses',
  'Contracts',
  'Reports',
  'Orders',
  'Knowledge Base',
  'Bank Account',
  'Messages',
  'Assets',
  'Zoom',
  'Recruit',
  'Payroll',
  'Purchase',
  'Letter',
  'OR Code',
  'Biolinks',
  'Performance',
  'Biometric',
]

const FloatingGroupBox = ({ label, children }) => {
  return (
    <Box
      position="relative"
      className="border"
      borderRadius={1}
      px={3}
      pt={3}
      pb={3}
      mt={3}
    >
      <Typography
        component="label"
        variant="subtitle"
        sx={{
          position: 'absolute',
          top: -11,
          left: 16,
          px: 1,
          backgroundColor: 'var(--mui-palette-background-paper)',
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}

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

const PackageListTable = () => {
  // Renamed component, removed companyData prop
  // States
  const [status, setStatus] = useState('') // This might be repurposed for package type or status if needed
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([]) // Initialize with empty array for packages
  const [filteredData, setFilteredData] = useState([]) // Initialize with empty array
  const [globalFilter, setGlobalFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [moduleOptions, setModuleOptions] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // formData might be used for a "Quick Add" form or for the expanded row editing.
  // For now, aligning its structure with the Package model.
  const [formData, setFormData] = useState({
    name: '',
    type: 'paid', // Default type
    maxEmployees: 0,
    positionNo: 0,
    private: false,
    recommended: false,
    monthly_currency: 'USD',
    yearly_currency: 'USD',
    hasMonthly: false,
    monthlyPrice: 0,
    hasAnnual: false,
    annualPrice: 0,
    features: [],
    modules: [],
  })

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const modules = await response.json()
          setModuleOptions(modules)
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }
    fetchModules()
  }, [])

  // Fetch package data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')

        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }

        const packages = await response.json()

        setData(packages)
        setFilteredData(packages) // Initially, filteredData is all data
      } catch (error) {
        console.error(error)

        // Handle error (e.g., show a toast notification)
      }
    }

    fetchPackages()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        maxSize: 100,
      }),
      // Redefine columns for Package data
      columnHelper.accessor('name', {
        header: 'Package Name',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.name}</Typography>
        ),
      }),

      columnHelper.accessor('packageType', {
        header: 'Package Type',
        cell: ({ row }) => (
          <Chip
            label={row.original.packageType}
            color={row.original.packageType === 'paid' ? 'primary' : 'success'}
            variant="tonal"
            size="small"
          />
        ),
      }),
      columnHelper.accessor('maxEmployees', {
        header: 'Max Employees',
        cell: ({ row }) => <Typography>{row.original.maxEmployees}</Typography>,
      }),
      columnHelper.accessor('monthlyPrice', {
        header: 'Monthly Price',
        cell: ({ row }) => (
          <Typography>
            {row.original.hasMonthly ? `$${row.original.monthlyPrice}` : 'N/A'}
          </Typography>
        ),
        sortingFn: (rowA, rowB, columnId) => {
          const a = rowA.original.hasMonthly ? rowA.original.monthlyPrice : 0
          const b = rowB.original.hasMonthly ? rowB.original.monthlyPrice : 0
          return a - b
        },
      }),
      columnHelper.accessor('annualPrice', {
        header: 'Annual Price',
        cell: ({ row }) => (
          <Typography>
            {row.original.hasAnnual ? `$${row.original.annualPrice}` : 'N/A'}
          </Typography>
        ),
      }),
      {
        accessorKey: 'features',
        header: 'Features',
        cell: ({ row }) => {
          const features = row.original.features || []
          return (
            <div className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="tonal"
                />
              ))}
              {features.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{features.length - 3} more
                </Typography>
              )}
            </div>
          )
        },
      },
      columnHelper.accessor('action', {
        header: () => <div className="text-right">ACTION</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <ActionBtn
              href={getLocalizedUrl(
                `/packages/edit/${row.original.id}`,
                locale
              )} // Main button action
              mainButtonText="Edit"
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: getLocalizedUrl(
                    `/packages/edit/${row.original.id}`,
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
                    onClick: () => handleDeleteClick(row.original),
                    className: 'flex items-center gap-2 text-textSecondary',
                  },
                },
              ]}
            />
          </div>
        ),
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData, locale] // Added locale to dependencies
  )

  const table = useReactTable({
    data: filteredData, // Use filteredData
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter: '', // Don't use globalFilter here since we handle it manually
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: 'monthlyPrice',
          desc: false, // Sort ascending (lowest to highest price)
        },
      ],
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  // Removed getAvatar function as it's not used for packages in this setup

  useEffect(() => {
    // Filter data based on globalFilter only
    let newFilteredData = data || [] // Ensure data is not null/undefined

    if (globalFilter) {
      newFilteredData = newFilteredData.filter((pkg) => {
        // Adjust filtering logic based on what fields you want to search
        return (
          (pkg.name &&
            pkg.name.toLowerCase().includes(globalFilter.toLowerCase())) ||
          (pkg.type &&
            pkg.type.toLowerCase().includes(globalFilter.toLowerCase()))
        )
      })
    }

    setFilteredData(newFilteredData)
  }, [globalFilter, data])

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Handle changes to features/modules for a specific row in expanded view
  // This is a simplified example; a more robust solution might involve updating state differently
  const handleExpandedRowChange = (rowId, field, value) => {
    // This function is for display purposes in the expanded row.
    // If inline editing is needed, this would need to update the main 'data' state
    // and potentially trigger a PUT request.
    // For now, we assume 'formData' in expanded row is for display or a new item,
    // not direct inline editing of existing items' features/modules.
    // The checkboxes in expanded rows will now use the row's actual data.
  }

  const handleDeleteClick = (packageData) => {
    setPackageToDelete(packageData)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setPackageToDelete(null)
  }

  const handleDeleteConfirm = () => {
    // Remove the deleted package from the state
    if (packageToDelete) {
      setData((prevData) =>
        prevData.filter((pkg) => pkg.id !== packageToDelete.id)
      )
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((pkg) => pkg.id !== packageToDelete.id)
      )
    }
  }

  return (
    <Card>
      <CardContent className="flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
        <Button
          variant="contained"
          component={Link}
          startIcon={<i className="ri-add-line" />}
          href={getLocalizedUrl('packages/add', locale)}
          className="max-sm:is-full"
        >
          Create Package
        </Button>
        <div className="flex items-center flex-col sm:flex-row max-sm:is-full gap-4">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Package"
            className="max-sm:is-full min-is-[250px]"
          />
        </div>
      </CardContent>
      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: header.getSize() }}>
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
                        // {/* Expanded row content: Display features and modules of the specific package */}
                        // The duplicate line that was here has been removed.
                        <tr>
                          <td
                            colSpan={row.getVisibleCells().length}
                            className="bg-muted pb-5 pl-20 pr-20 text-sm"
                          >
                            <Grid container spacing={4}>
                              <Grid xs={12} sm={8}>
                                <FloatingGroupBox label="Features">
                                  <Grid container spacing={2}>
                                    {/* Assuming row.original.features is an array of strings */}
                                    {featureOptions.map((feature, index) => (
                                      <Grid xs={6} sm={4} md={3} key={index}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              // Check if the package's features array includes this feature
                                              checked={
                                                row.original.features?.includes(
                                                  feature
                                                ) || false
                                              }
                                              // For display only, disable onChange or make it part of an edit mode
                                              readOnly
                                              disabled
                                            />
                                          }
                                          label={feature}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </FloatingGroupBox>
                              </Grid>
                              <Grid xs={12} sm={4}>
                                <FloatingGroupBox label="Modules">
                                  <Grid container spacing={2}>
                                    {/* Assuming row.original.modules is an array of strings */}
                                    {moduleOptions.map((module, index) => (
                                      <Grid xs={6} key={index}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              // Check if the package's modules array includes this module ID
                                              checked={
                                                row.original.modules?.includes(
                                                  module.id
                                                ) || false
                                              }
                                              // For display only, disable onChange or make it part of an edit mode
                                              readOnly
                                              disabled
                                            />
                                          }
                                          label={module.name}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </FloatingGroupBox>
                              </Grid>
                            </Grid>
                          </td>
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
      <DeletePackageDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        packageData={packageToDelete}
      />
    </Card>
  )
}

export default PackageListTable // Renamed export
