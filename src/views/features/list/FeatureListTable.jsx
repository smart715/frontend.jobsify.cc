'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import { styled } from '@mui/material/styles'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

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
import AddFeatureDrawer from './AddFeatureDrawer'
import ActionBtn from '@/components/ActionBtn'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

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
  }, [value])

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

// Column Definitions
const columnHelper = createColumnHelper()

const FeatureListTable = ({ tableData = [] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [featureToDelete, setFeatureToDelete] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch features data on component mount
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/features')
        if (response.ok) {
          const featuresData = await response.json()
          setData(featuresData)
        }
      } catch (error) {
        console.error('Error fetching features:', error)
        setData([]) // Set empty array as fallback
      }
    }

    if (!tableData || tableData.length === 0) {
      fetchFeatures()
    }
  }, [tableData])

  // Update data when tableData prop changes
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setData(tableData)
    }
  }, [tableData])

  const handleAddFeature = () => {
    setSelectedFeature(null)
    setDrawerOpen(true)
  }

  const handleEditFeature = (feature) => {
    console.log('=== handleEditFeature START ===')
    console.log('handleEditFeature called with:', feature) // Debug log
    console.log('Feature object:', JSON.stringify(feature, null, 2))
    console.log('Current drawer state:', drawerOpen) // Debug log
    console.log('Current selected feature:', selectedFeature) // Debug log

    setSelectedFeature(feature)
    setDrawerOpen(true)

    console.log('After setting state - drawer should be:', true)
    console.log('After setting state - selected feature should be:', feature)
    console.log('=== handleEditFeature END ===')
  }

  const handleDrawerClose = () => {
    console.log('handleDrawerClose called') // Debug log
    console.log('Closing drawer and resetting state') // Debug log
    setDrawerOpen(false)
    // Add a small delay before resetting selectedFeature to prevent race condition
    setTimeout(() => {
      setSelectedFeature(null)
    }, 100)
  }

  const handleFeatureSuccess = async () => {
    // Refresh the features data
    try {
      const response = await fetch('/api/features')
      if (response.ok) {
        const updatedData = await response.json()
        setData(updatedData)
      }
    } catch (error) {
      console.error('Error refreshing features:', error)
    }
  }

  const handleDeleteClick = (feature) => {
    setFeatureToDelete(feature)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!featureToDelete) return

    try {
      const response = await fetch(`/api/features/${featureToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted feature from the local state
        setData((prevData) =>
          prevData.filter((item) => item.id !== featureToDelete.id)
        )
        setDeleteDialogOpen(false)
        setFeatureToDelete(null)
      } else {
        console.error('Failed to delete feature')
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setFeatureToDelete(null)
  }

  const columns = useMemo(
    () => [
      // Serial Number column
      columnHelper.accessor('serialNumber', {
        header: 'S. NO.',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
        enableSorting: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
      }),
      columnHelper.accessor('name', {
        header: 'FEATURE NAME',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {row.original.name}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('description', {
        header: 'DESCRIPTION',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Typography className="font-medium" color="text.primary">
              {row.original.description || 'No description'}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor('isActive', {
        header: 'STATUS',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={row.original.isActive ? 'Active' : 'Inactive'}
              color={row.original.isActive ? 'success' : 'secondary'}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor('sortOrder', {
        header: 'SORT ORDER',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.sortOrder || '-'}
          </Typography>
        ),
      }),
      columnHelper.accessor('action', {
        header: () => <div className="text-right">ACTION</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <ActionBtn
              mainButtonText="View"
              mainButtonIcon="ri-eye-line"
              mainButtonAction={(e) => {
                e?.preventDefault()
                e?.stopPropagation()
                console.log('View button clicked for feature:', row.original)
                console.log('Feature ID:', row.original?.id)
                console.log('Feature name:', row.original?.name)
                handleEditFeature(row.original)
              }}
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    onClick: () => {
                      console.log(
                        'Menu Edit clicked for feature:',
                        row.original
                      )
                      handleEditFeature(row.original)
                    },
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
    []
  )

  // Hooks
  const table = useReactTable({
    data,
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

  return (
    <>
      <Card>
        <CardContent className="flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
          <Button
            variant="contained"
            startIcon={<i className="ri-add-line" />}
            onClick={handleAddFeature}
            className="max-sm:is-full"
          >
            Add Feature
          </Button>
          <div className="flex items-center flex-col sm:flex-row max-sm:is-full gap-4">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search Feature"
              className="max-sm:is-full min-is-[250px]"
              size="small"
            />
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
                      <tr
                        key={row.id}
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
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

      {/* Add/Edit Feature Drawer */}
      <AddFeatureDrawer
        open={drawerOpen}
        handleClose={handleDrawerClose}
        feature={selectedFeature}
        onSuccess={handleFeatureSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Feature</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the feature "{featureToDelete?.name}
            "? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FeatureListTable
