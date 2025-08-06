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
import Box from '@mui/material/Box'

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
import AddSupportTicketDrawer from './AddSupportTicketDrawer'
import ViewSupportTicketDrawer from './ViewSupportTicketDrawer'
import EditSupportTicketDrawer from './EditSupportTicketDrawer'
import ActionBtn from '@/components/ActionBtn'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

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

const SupportTicketList = () => {
  // States
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addSupportTicketOpen, setAddSupportTicketOpen] = useState(false)
  const [viewSupportTicketOpen, setViewSupportTicketOpen] = useState(false)
  const [editSupportTicketOpen, setEditSupportTicketOpen] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch support tickets data
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        const response = await fetch('/api/support')

        if (!response.ok) {
          throw new Error('Failed to fetch support tickets')
        }

        const tickets = await response.json()
        setData(tickets)
        setFilteredData(tickets)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSupportTickets()
  }, [])

  const columns = useMemo(
    () => [
      // Serial Number column
      columnHelper.accessor('serialNumber', {
        header: 'S. NO.',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
        enableSorting: false,
        size: 80,
        minSize: 60,
        maxSize: 100
      }),

      columnHelper.accessor('ticketNumber', {
        header: 'TICKET NUMBER',
        cell: ({ row }) => <Typography color='text.primary' className='font-medium'>{row.original.ticketNumber}</Typography>
      }),

      columnHelper.accessor('subject', {
        header: 'SUBJECT',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.subject}</Typography>
      }),

      columnHelper.accessor('requesterName', {
        header: 'REQUESTER',
        cell: ({ row }) => <Typography>{row.original.requesterName || 'N/A'}</Typography>
      }),

      columnHelper.accessor('companyName', {
        header: 'COMPANY',
        cell: ({ row }) => <Typography>{row.original.companyName || 'N/A'}</Typography>
      }),

      columnHelper.accessor('priority', {
        header: 'PRIORITY',
        cell: ({ row }) => {
          const priority = row.original.priority
          const colorMap = {
            'Low': 'success',
            'Medium': 'warning', 
            'High': 'error'
          }
          return (
            <Chip 
              label={priority} 
              color={colorMap[priority] || 'default'}
              variant="tonal" 
              size="small"
            />
          )
        }
      }),

      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: ({ row }) => {
          const status = row.original.status
          const colorMap = {
            'Open': 'info',
            'In Progress': 'warning',
            'Resolved': 'success',
            'Closed': 'default'
          }
          return (
            <Chip 
              label={status} 
              color={colorMap[status] || 'default'}
              variant="tonal" 
              size="small"
            />
          )
        }
      }),

      columnHelper.accessor('createdAt', {
        header: 'CREATED DATE',
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Typography>
        )
      }),

      columnHelper.accessor('action', {
        header: () => <div className='text-right'>ACTION</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end'>
            <ActionBtn
              mainButtonText="View"
              mainButtonAction={() => {
                setSelectedTicketId(row.original.id)
                setViewSupportTicketOpen(true)
              }}
              options={[
                {
                  text: 'View',
                  icon: 'ri-eye-line',
                  menuItemProps: { 
                    onClick: () => {
                      setSelectedTicketId(row.original.id)
                      setViewSupportTicketOpen(true)
                    },
                    className: 'flex items-center gap-2 text-textSecondary' 
                  }
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: { 
                    onClick: () => {
                      setSelectedTicketId(row.original.id)
                      setEditSupportTicketOpen(true)
                    },
                    className: 'flex items-center gap-2 text-textSecondary' 
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: async () => {
                      if (window.confirm('Are you sure you want to delete this support ticket?')) {
                        try {
                          const response = await fetch(`/api/support/${row.original.id}`, {
                            method: 'DELETE',
                          });

                          if (!response.ok) {
                            throw new Error('Failed to delete support ticket');
                          }

                          setData(prevData => prevData.filter(ticket => ticket.id !== row.original.id));
                          setFilteredData(prevFilteredData => prevFilteredData.filter(ticket => ticket.id !== row.original.id));
                        } catch (error) {
                          console.error('Error deleting support ticket:', error);
                        }
                      }
                    },
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, filteredData, locale]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter: ''
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

  useEffect(() => {
    let newFilteredData = data || []

    if (globalFilter) {
      newFilteredData = newFilteredData.filter(ticket => {
        return (
          (ticket.ticketNumber && ticket.ticketNumber.toLowerCase().includes(globalFilter.toLowerCase())) ||
          (ticket.subject && ticket.subject.toLowerCase().includes(globalFilter.toLowerCase())) ||
          (ticket.requesterName && ticket.requesterName.toLowerCase().includes(globalFilter.toLowerCase())) ||
          (ticket.companyName && ticket.companyName.toLowerCase().includes(globalFilter.toLowerCase()))
        );
      });
    }

    if (status) {
      newFilteredData = newFilteredData.filter(ticket => ticket.status === status)
    }

    if (priority) {
      newFilteredData = newFilteredData.filter(ticket => ticket.priority === priority)
    }

    setFilteredData(newFilteredData);
  }, [globalFilter, status, priority, data]);

  return (
    <>
      <Card>
        <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
          <div className='flex flex-col gap-4'>
            <Box>
              <Typography variant="h5">Support Tickets</Typography>
              <Typography variant="body2" color="text.secondary">
                Home {' > '} Support Tickets
              </Typography>
            </Box>
          </div>
          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            onClick={() => setAddSupportTicketOpen(true)}
            className='max-sm:is-full'
          >
            Create Support Ticket
          </Button>
        </CardContent>

        <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
          <div className='flex items-center flex-col sm:flex-row max-sm:is-full gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Support Tickets'
              className='max-sm:is-full min-is-[250px]'
            />
            <FormControl size='small' className='max-sm:is-full min-is-[150px]'>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={e => setStatus(e.target.value)}
                label='Status'
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Open'>Open</MenuItem>
                <MenuItem value='In Progress'>In Progress</MenuItem>
                <MenuItem value='Resolved'>Resolved</MenuItem>
                <MenuItem value='Closed'>Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size='small' className='max-sm:is-full min-is-[150px]'>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                label='Priority'
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Low'>Low</MenuItem>
                <MenuItem value='Medium'>Medium</MenuItem>
                <MenuItem value='High'>High</MenuItem>
              </Select>
            </FormControl>
          </div>
        </CardContent>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: header.getSize() }}>
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No support tickets available
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
                          <td key={cell.id} style={{ width: cell.column.getSize() }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <AddSupportTicketDrawer 
        open={addSupportTicketOpen} 
        handleClose={() => setAddSupportTicketOpen(false)}
        setData={setData}
      />

      <ViewSupportTicketDrawer 
        open={viewSupportTicketOpen} 
        handleClose={() => {
          setViewSupportTicketOpen(false)
          setSelectedTicketId(null)
        }}
        ticketId={selectedTicketId}
      />

      <EditSupportTicketDrawer 
        open={editSupportTicketOpen} 
        handleClose={() => {
          setEditSupportTicketOpen(false)
          setSelectedTicketId(null)
        }}
        ticketId={selectedTicketId}
        setData={setData}
        setFilteredData={setFilteredData}
      />
    </>
  )
}

export default SupportTicketList