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
import CustomAvatar from '@core/components/mui/Avatar'
import AddClientDrawer from './AddClientDrawer'
import ActionBtn from '@/components/ActionBtn'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  ...props
}) => {
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

  return (
    <TextField
      {...props}
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <i className="ri-search-line text-textSecondary" />
          </InputAdornment>
        ),
      }}
    />
  )
}

const columnHelper = createColumnHelper()

const ClientListTable = ({ clientsData }) => {
  // States
  const [data, setData] = useState(clientsData || [])
  const [filteredData, setFilteredData] = useState(clientsData || [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    const initialData = clientsData || []
    setData(initialData)
    setFilteredData(initialData)
  }, [clientsData])

  // Handle client editing
  const handleEditClient = (client) => {
    setEditingClient(client)
    setAddClientOpen(true)
  }

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this client? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(`/api/clients/${clientId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setData((prevData) =>
            prevData.filter((client) => client.id !== clientId)
          )
          setFilteredData((prevData) =>
            prevData.filter((client) => client.id !== clientId)
          )
        } else {
          alert('Failed to delete client. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting client:', error)
        alert('An error occurred while deleting the client.')
      }
    }
  }

  const updateData = useCallback(
    (newClient) => {
      if (editingClient) {
        // Update existing client
        setData((prevData) =>
          prevData.map((client) =>
            client.id === editingClient.id
              ? { ...client, ...newClient }
              : client
          )
        )
        setFilteredData((prevData) =>
          prevData.map((client) =>
            client.id === editingClient.id
              ? { ...client, ...newClient }
              : client
          )
        )
      } else {
        // Add new client
        setData((prevData) => [newClient, ...prevData])
        setFilteredData((prevData) => [newClient, ...prevData])
      }
    },
    [editingClient]
  )

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
      columnHelper.accessor('clientId', {
        header: 'Client ID',
        cell: ({ row }) => (
          <Typography className="font-medium" color="text.primary">
            {row.original.clientId}
          </Typography>
        ),
      }),
      columnHelper.accessor('firstName', {
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <CustomAvatar size={34}>
              {getInitials(
                `${row.original.firstName} ${row.original.lastName}`
              )}
            </CustomAvatar>
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {`${row.original.firstName} ${row.original.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {row.original.company || 'No Company'}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color="text.primary">{row.original.email}</Typography>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Mobile',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.phone || '--'}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={row.original.status}
              size="small"
              color={row.original.status === 'Active' ? 'success' : 'secondary'}
            />
          </div>
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
                  href: getLocalizedUrl(
                    `/clients/view/${row.original.id}`,
                    locale
                  ),
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                  },
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: getLocalizedUrl(
                    `/clients/edit/${row.original.id}`,
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
                    onClick: () => handleDeleteClient(row.original.id),
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
    [updateData, locale]
  )

  const table = useReactTable({
    data: filteredData,
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

  return (
    <>
      <Card>
        <CardContent className="flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
          <Button
            variant="contained"
            startIcon={<i className="ri-add-line" />}
            component={Link}
            href={getLocalizedUrl('/clients/add', locale)}
            className="max-sm:is-full"
          >
            Add Customer
          </Button>
          <div className="flex items-center flex-col sm:flex-row max-sm:is-full gap-4">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search Client"
              className="max-sm:is-full"
              sx={{ minWidth: 250 }}
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
      <AddClientDrawer
        open={addClientOpen}
        handleClose={() => {
          setAddClientOpen(false)
          setEditingClient(null)
        }}
        clientData={editingClient}
        updateData={updateData}
      />
    </>
  )
}

export default ClientListTable
