'use client'

// React Imports
import { useEffect, useState, useMemo, useCallback } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
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
  getSortedRowModel,
} from '@tanstack/react-table'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import AddInvoiceDrawer from './AddInvoiceDrawer'
import ActionBtn from '@/components/ActionBtn'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { formatCurrency, getStatusColor } from '@/utils/invoiceUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

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
  }, [value, onChange, debounce])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper()

const InvoiceListTable = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  const { lang: locale } = useParams()

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/invoices')
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
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleDeleteInvoice = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setData(prev => prev.filter(invoice => invoice.id !== id))
        setFilteredData(prev => prev.filter(invoice => invoice.id !== id))
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }, [])

  const updateData = useCallback(
    (newInvoice) => {
      if (editingInvoice) {
        // Update existing invoice
        setData((prevData) =>
          prevData.map((invoice) =>
            invoice.id === editingInvoice.id
              ? { ...invoice, ...newInvoice }
              : invoice
          )
        )
        setFilteredData((prevData) =>
          prevData.map((invoice) =>
            invoice.id === editingInvoice.id
              ? { ...invoice, ...newInvoice }
              : invoice
          )
        )
      } else {
        // Add new invoice
        setData((prevData) => [newInvoice, ...prevData])
        setFilteredData((prevData) => [newInvoice, ...prevData])
      }
    },
    [editingInvoice]
  )

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
      columnHelper.accessor('invoiceId', {
        header: 'Invoice ID',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.invoiceId}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('projectName', {
        header: 'Project',
        cell: ({ row }) => (
          <Typography>{row.original.projectName || 'N/A'}</Typography>
        )
      }),
      columnHelper.accessor('clientId', {
        header: 'Client',
        cell: ({ row }) => (
          <Typography>{row.original.clientId || 'N/A'}</Typography>
        )
      }),
      columnHelper.accessor('amount', {
        header: 'Total',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium'>
              {formatCurrency(row.original.amount)}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Unpaid: {formatCurrency(row.original.unpaidAmount || 0)}
            </Typography>
          </div>
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
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            size='small'
            label={row.original.status}
            color={getStatusColor(row.original.status)}
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setEditingInvoice(row.original)
                setAddInvoiceOpen(true)
              }}
            >
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'View',
                  href: getLocalizedUrl(`/invoices/view/${row.original.id}`, locale),
                  icon: 'ri-eye-line'
                },
                {
                  text: 'Edit',
                  onClick: () => {
                    setEditingInvoice(row.original)
                    setAddInvoiceOpen(true)
                  },
                  icon: 'ri-edit-box-line'
                },
                {
                  text: 'Delete',
                  onClick: () => handleDeleteInvoice(row.original.id),
                  icon: 'ri-delete-bin-7-line'
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [editingInvoice, locale, handleDeleteInvoice]
  )

  const table = useReactTable({
    data: filteredData,
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
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-end gap-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Invoices'
              className='is-full sm:is-auto'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='ri-search-line' />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            
          </div>
        </CardContent>
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
            {table.getFilteredRowModel().rows.lengt === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {loading ? 'Loading...' : 'No data available'}
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
      <AddInvoiceDrawer
        open={addInvoiceOpen}
        handleClose={() => {
          setAddInvoiceOpen(false)
          setEditingInvoice(null)
        }}
        updateData={updateData}
        invoiceData={editingInvoice}
      />
    </>
  )
}

export default InvoiceListTable