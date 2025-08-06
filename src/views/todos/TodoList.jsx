
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
import ActionBtn from '@/components/ActionBtn'
import AddTaskDrawer from './AddTaskDrawer'
import EditTaskDrawer from './EditTaskDrawer'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Toast
import { toast } from 'react-toastify'

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

const TodoList = ({ dictionary }) => {
  // States
  const [status, setStatus] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const tasks = await response.json()
        setData(tasks)
        setFilteredData(tasks)
      } else {
        toast.error('Failed to fetch tasks')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          toast.success('Task deleted successfully')
          setData(prevData => prevData.filter(task => task.id !== taskId))
          setFilteredData(prevFilteredData => prevFilteredData.filter(task => task.id !== taskId))
        } else {
          toast.error('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        toast.error('Failed to delete task')
      }
    }
  }

  // Handle edit task
  const handleEditTask = (task) => {
    setSelectedTask(task)
    setEditTaskOpen(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US')
  }

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
        ),
        size: 60,
        minSize: 60,
        maxSize: 60
      },
      columnHelper.accessor('id', {
        header: '#',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.index + 1}</Typography>
        ),
        size: 50,
        minSize: 40,
        maxSize: 60
      }),
      columnHelper.accessor('task', {
        header: 'Task',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.task}
            </Typography>
            {row.original.description && (
              <Typography variant='body2' color='text.secondary'>
                {row.original.description}
              </Typography>
            )}
          </div>
        ),
        size: 250,
        minSize: 200,
        maxSize: 300
      }),
      columnHelper.accessor('started', {
        header: 'Started',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.started ? 'Yes' : 'No'}
            size='small'
            color={row.original.started ? 'success' : 'secondary'}
          />
        ),
        size: 80,
        minSize: 70,
        maxSize: 100
      }),
      columnHelper.accessor('program', {
        header: 'Program',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.program || '-'}
          </Typography>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150
      }),
      columnHelper.accessor('design', {
        header: 'Design',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.design || '-'}
          </Typography>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.date ? new Date(row.original.date).toLocaleDateString() : '-'}
          </Typography>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150
      }),
      columnHelper.accessor('approved', {
        header: 'Approved',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.approved || '-'}
          </Typography>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <ActionBtn
              mainButtonText="Edit"
              options={[
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  menuItemProps: {
                    onClick: () => handleEditTask(row.original),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: () => handleDeleteTask(row.original.id),
                    className: 'flex items-center gap-2 text-textSecondary'
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 100,
        minSize: 80,
        maxSize: 120
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
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
    // Filter data based on globalFilter and status
    let newFilteredData = data || []

    if (globalFilter) {
      newFilteredData = newFilteredData.filter(task => {
        return (
          task.task.toLowerCase().includes(globalFilter.toLowerCase()) ||
          task.description?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          task.program?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          task.design?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          task.approved?.toLowerCase().includes(globalFilter.toLowerCase())
        )
      })
    }

    if (status) {
      newFilteredData = newFilteredData.filter(task => {
        if (status === 'started') return task.started
        if (status === 'not-started') return !task.started
        return true
      })
    }

    setFilteredData(newFilteredData)
  }, [globalFilter, status, data])

  return (
    <Card>
      <CardContent className='flex justify-between flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center'>
        <Button
          variant='contained'
          startIcon={<i className='ri-add-line' />}
          onClick={() => setAddTaskOpen(true)}
          className='max-sm:is-full'
        >
          Add Task
        </Button>
        <div className='flex items-center flex-col sm:flex-row max-sm:is-full gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Task'
            className='max-sm:is-full min-is-[250px]'
          />
          <FormControl fullWidth size='small' className='max-sm:is-full min-is-[175px]'>
            <InputLabel id='task-status-select'>Task Status</InputLabel>
            <Select
              fullWidth
              id='select-task-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              label='Task Status'
              labelId='task-status-select'
            >
              <MenuItem value=''>All Status</MenuItem>
              <MenuItem value='started'>Started</MenuItem>
              <MenuItem value='not-started'>Not Started</MenuItem>
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
                  <th key={header.id} style={{ width: header.getSize(), textTransform: 'capitalize' }}>
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
                  {loading ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
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

      <AddTaskDrawer
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onTaskAdded={fetchTasks}
      />

      <EditTaskDrawer
        open={editTaskOpen}
        onClose={() => {
          setEditTaskOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onTaskUpdated={fetchTasks}
      />
    </Card>
  )
}

export default TodoList
