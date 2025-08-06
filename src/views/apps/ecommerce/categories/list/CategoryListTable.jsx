
'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
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

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const StyledTable = styled('table')(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  '& .table-header': {
    backgroundColor: theme.palette.customColors.tableHeaderBg,
  },
}))

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
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

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const CategoryListTable = () => {
  // States
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Hooks
  const router = useRouter()

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/ecommerce/categories')
        if (response.ok) {
          const categories = await response.json()
          setData(categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget)
    setSelectedCategory(category)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedCategory(null)
  }

  const handleEdit = () => {
    if (selectedCategory) {
      router.push(`/ecommerce/categories/edit/${selectedCategory.id}`)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedCategory && confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/ecommerce/categories/${selectedCategory.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setData(prev => prev.filter(cat => cat.id !== selectedCategory.id))
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
    handleMenuClose()
  }

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
        size: 80
      },
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar 
              src={row.original.image || ''} 
              size={40}
              sx={{ 
                backgroundColor: row.original.image ? 'transparent' : 'primary.main',
                border: '1px solid #e0e0e0'
              }}
            >
              {row.original.title?.charAt(0) || 'C'}
            </Avatar>
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.title || 'Untitled Category'}
              </Typography>
              {row.original.description && (
                <Typography variant="body2" color="text.secondary">
                  {row.original.description}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('products', {
        header: 'Products',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.productCount || 0}
          </Typography>
        )
      }),
      columnHelper.accessor('productConditions', {
        header: 'Product conditions',
        cell: ({ row }) => (
          <Typography color="text.secondary">
            {row.original.conditions || '-'}
          </Typography>
        )
      }),
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <IconButton
            onClick={(e) => handleMenuOpen(e, row.original)}
            size="small"
          >
            <i className="ri-more-2-line" />
          </IconButton>
        ),
        enableSorting: false,
        size: 60
      }
    ],
    []
  )

  const table = useReactTable({
    data,
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
    globalFilterFn: fuzzyFilter,
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
        <CardHeader title="Categories" />
        <div className="flex justify-center p-5">
          <Typography>Loading categories...</Typography>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader 
          title="Categories"
          action={
            <Button
              variant="contained"
              startIcon={<i className="ri-add-line" />}
              component={Link}
              href="/ecommerce/categories/add"
            >
              Add Category
            </Button>
          }
        />
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={globalFilter === '' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setGlobalFilter('')}
              >
                All
              </Button>
              <Button variant="text" size="small">
                <i className="ri-add-line" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <i className="ri-search-line" />
              <i className="ri-settings-3-line" />
              <i className="ri-fullscreen-line" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <StyledTable className={tableStyles.table}>
              <thead className="table-header">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} style={{ width: header.getSize() }}>
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
                    <td colSpan={table.getVisibleFlatColumns().length} className="text-center p-8">
                      <div className="flex flex-col items-center">
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                          Learn more about <Link href="#" className="text-primary">categories</Link>
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          No categories found
                        </Typography>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.slice(0, table.getState().pagination.pageSize).map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </StyledTable>
          </div>

          {table.getFilteredRowModel().rows.length > 0 && (
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
          )}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleEdit}>
          <i className="ri-pencil-line" style={{ marginRight: '8px' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <i className="ri-delete-bin-7-line" style={{ marginRight: '8px' }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default CategoryListTable
