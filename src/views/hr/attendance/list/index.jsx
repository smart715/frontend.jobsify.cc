
'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

// Component Imports
import AttendanceTable from './AttendanceTable'
import MarkAttendanceDrawer from './MarkAttendanceDrawer'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'

const AttendanceList = () => {
  const [addAttendanceOpen, setAddAttendanceOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dictionary, setDictionary] = useState({})
  
  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedDesignation, setSelectedDesignation] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('July')
  const [selectedYear, setSelectedYear] = useState('2025')

  const { lang } = useParams()

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch dictionary
        const dict = await getDictionary(lang)
        setDictionary(dict)

        // Fetch employees
        const employeesRes = await fetch('/api/employees')
        if (employeesRes.ok) {
          const employeesData = await employeesRes.json()
          setEmployees(employeesData)
        }

        // Fetch departments
        const departmentsRes = await fetch('/api/departments')
        if (departmentsRes.ok) {
          const departmentsData = await departmentsRes.json()
          setDepartments(departmentsData)
        }

        // Fetch designations
        const designationsRes = await fetch('/api/designations')
        if (designationsRes.ok) {
          const designationsData = await designationsRes.json()
          setDesignations(designationsData)
        }

        // Fetch attendance data (you'll need to create this API)
        const attendanceRes = await fetch('/api/attendance')
        if (attendanceRes.ok) {
          const attendanceData = await attendanceRes.json()
          setAttendanceData(attendanceData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lang])

  const handleMarkAttendance = async (attendanceData) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      })

      if (response.ok) {
        // Refresh attendance data
        const updatedRes = await fetch('/api/attendance')
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json()
          setAttendanceData(updatedData)
        }
        setAddAttendanceOpen(false)
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = ['2023', '2024', '2025', '2026']

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {dictionary?.navigation?.attendance || 'Attendance'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Home &gt; Attendance
                </Typography>
              </Box>
            }
            action={
              <Button
                variant="contained"
                color="error"
                startIcon={<i className="ri-add-line" />}
                onClick={() => setAddAttendanceOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Mark Attendance
              </Button>
            }
          />

          {/* Filters */}
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    label="Employee"
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {`${employee.firstName} ${employee.lastName || ''}`.trim()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    label="Department"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Designation</InputLabel>
                  <Select
                    value={selectedDesignation}
                    label="Designation"
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {designations.map((designation) => (
                      <MenuItem key={designation.id} value={designation.id}>
                        {designation.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<i className="ri-download-2-line" />}
                    sx={{ textTransform: 'none', minWidth: 'auto' }}
                  >
                    Import
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<i className="ri-upload-2-line" />}
                    sx={{ textTransform: 'none', minWidth: 'auto' }}
                  >
                    Export
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Legend */}
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">Holiday</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'error.main',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">Day Off</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'success.main',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">Present</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'secondary.main',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">Half Day</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'warning.light',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">Late</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  X
                </Typography>
                <Typography variant="body2">Absent</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: 'info.main',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="body2">On Leave</Typography>
              </Box>
            </Stack>
          </Box>

          <AttendanceTable
            employees={employees}
            attendanceData={attendanceData}
            loading={loading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </Card>
      </Grid>

      <MarkAttendanceDrawer
        open={addAttendanceOpen}
        handleClose={() => setAddAttendanceOpen(false)}
        onSubmit={handleMarkAttendance}
        employees={employees}
        departments={departments}
        dictionary={dictionary}
      />
    </Grid>
  )
}

export default AttendanceList
