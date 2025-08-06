'use client'

// React Imports
import { useEffect, useState, useMemo, useCallback } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
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
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters' // TODO: Copy and adapt this later
import AddCompanyDrawer from './AddCompanyDrawer' // TODO: Create this file later
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import ActionBtn from '@/components/ActionBtn'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
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

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const CompanyListTable = () => { // Removed tableData prop
  // States
  const [addCompanyOpen, setAddCompanyOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [rawData, setRawData] = useState([]) // To store data fetched from API
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // const [data, setData] = useState(tableData ? [...tableData] : []) // This will be derived from rawData
  const [filteredData, setFilteredData] = useState([]) // This will be derived from rawData or set by TableFilters
  const [globalFilter, setGlobalFilter] = useState('')


  // Hooks
  const { lang: locale } = useParams()

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/companies')

        if (!response.ok) {

          throw new Error(`Failed to fetch companies: ${response.status}`)
        }

        const companies = await response.json()
        
        setRawData(companies)
        
        // setData(companies) // Update main data state
        setFilteredData(companies) // Initially, filteredData is all data
      } catch (e) {
        setError(e.message)
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // This setData will be used by AddCompanyDrawer and delete action
  // It should update rawData and then filteredData as well.
  const updateData = useCallback((newDataOrUpdater) => {
    setRawData(prevRawData => {
      const newData = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prevRawData) : newDataOrUpdater;
      
      // Assuming TableFilters will re-filter when rawData changes or we manually trigger it.
      // For simplicity, let's also update filteredData here directly.
      // A more robust solution might involve re-applying filters from TableFilters.
      setFilteredData(newData);
      
      return newData;
    });
  }, []);


  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
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
        )
      },
      columnHelper.accessor('companyName', { // Changed from fullName to companyName
        header: 'Company', // Changed from User to Company
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {/* We might add company logos here later, for now just name and maybe a generic icon */}
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.companyName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.companyName}
              </Typography>
              {row.original.website && ( // Display website if available
                <Typography variant='body2'>{row.original.website}</Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('companyEmail', { // Changed accessor to companyEmail
        header: 'Email', // Header can remain 'Email'
        cell: ({ row }) => <Typography>{row.original.companyEmail || '-'}</Typography> // Display companyEmail, handle if undefined
      }),
columnHelper.accessor('package', {
        header: 'Package',
        cell: ({ row }) => <Typography>{row.original.package || '-'}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status || 'Unknown'}
            color={row.original.status === 'Active' ? 'success' : row.original.status === 'Inactive' ? 'error' : 'default'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('lastActivity', {
        header: 'Last Activity',
        cell: ({ row }) => <Typography>{row.original.lastActivity ? new Date(row.original.lastActivity).toLocaleDateString() : '-'}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <ActionBtn // TODO: Update this ActionBtn's props if its internal structure needs changes for companies
              href={getLocalizedUrl('/apps/company/view', locale)} // Changed path to /apps/company/view
              options={[
                {
                  text: 'View',
                  icon: 'ri-eye-line',
                  href: getLocalizedUrl('/apps/company/view', locale), // Changed path
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                
                // Download option might not be relevant for company, or might download company details
                // {
                //   text: 'Download',
                //   icon: 'ri-download-line',
                //   href: '' + row.original.id,
                //   menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                // },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: getLocalizedUrl(`/apps/company/edit/${row.original.id}`, locale), // Example edit path
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  
                  // href: '', // Action handled by onClick
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => {
                      // Optimistically update UI, or refetch after delete
                      updateData(currentData => currentData?.filter(company => company.id !== row.original.id))
                      
                      // TODO: Add API call to delete company from backend
                    }
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateData, locale] // Added updateData and locale to dependencies
  )

  const table = useReactTable({
    data: filteredData, // Use filteredData which is managed by states and TableFilters
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // Removed getAvatar function as it's not used for now
  // It can be added back if company logos/initials are implemented

  return (
    <>
      <Card>
        <CardHeader title='Company Filters' className='pbe-4' />
        <TableFilters setData={setFilteredData} tableData={rawData} /> {/* Pass rawData to filters, filters call setFilteredData */}
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export Companies
          </Button>
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Company' // Changed placeholder
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={() => setAddCompanyOpen(!addCompanyOpen)} className='max-sm:is-full'>
              Add New Company
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
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
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading && (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!isLoading && error && (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center text-red-500'>
                    Error: {error}
                  </td>
                </tr>
              </tbody>
            )}
            {!isLoading && !error && table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No companies found
                  </td>
                </tr>
              </tbody>
            ) : (
              !isLoading && !error && (
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
            ))}
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
      <AddCompanyDrawer // Changed from AddUserDrawer to AddCompanyDrawer
        open={addCompanyOpen}
        handleClose={() => setAddCompanyOpen(!addCompanyOpen)}
        setData={updateData} // Pass the new updateData function
      />
    </>
  )
}

export default CompanyListTable // Changed export name
