'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Box,
  Stack,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import ActionBtn from '@/components/ActionBtn'

// Currency data with symbols
const CURRENCY_DATA = {
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
}

const CurrencySettings = () => {
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(null)
  const [currencyToDelete, setCurrencyToDelete] = useState(null)

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: '',
      symbol: '',
      code: '',
      rate: 1,
      format: '',
      isDefault: false
    }
  })

  // Fetch currencies
  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/currencies')
      if (response.ok) {
        const data = await response.json()
        setCurrencies(data)
      }
    } catch (error) {
      console.error('Error fetching currencies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleAddCurrency = () => {
    reset({
      name: '',
      symbol: '',
      code: '',
      rate: 1,
      format: '',
      isDefault: false
    })
    setOpenAddDialog(true)
  }

  const handleEditCurrency = (currency) => {
    setSelectedCurrency(currency)
    reset({
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
      rate: currency.rate,
      format: currency.format,
      isDefault: currency.isDefault
    })
    setOpenEditDialog(true)
  }

  const handleDeleteCurrency = (currency) => {
    setCurrencyToDelete(currency)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (currencyToDelete) {
      try {
        const response = await fetch(`/api/currencies/${currencyToDelete.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchCurrencies()
          setOpenDeleteDialog(false)
          setCurrencyToDelete(null)
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to delete currency')
        }
      } catch (error) {
        console.error('Error deleting currency:', error)
        alert('Failed to delete currency')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      const url = selectedCurrency ? `/api/currencies/${selectedCurrency.id}` : '/api/currencies'
      const method = selectedCurrency ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchCurrencies()
        setOpenAddDialog(false)
        setOpenEditDialog(false)
        setSelectedCurrency(null)
        reset()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save currency')
      }
    } catch (error) {
      console.error('Error saving currency:', error)
      alert('Failed to save currency')
    }
  }

  const handleCurrencyCodeChange = (code, setValue) => {
    const currencyInfo = CURRENCY_DATA[code]
    if (currencyInfo) {
      setValue('symbol', currencyInfo.symbol)
      setValue('name', currencyInfo.name)
      setValue('format', `${currencyInfo.symbol}1,000.00`)
    }
  }

  const paginatedCurrencies = currencies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const AddEditDialog = ({ open, onClose, title, isEdit = false }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="code"
                control={control}
                rules={{ required: 'Currency code is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.code}>
                    <InputLabel>Currency Code</InputLabel>
                    <Select
                      {...field}
                      label="Currency Code"
                      onChange={(e) => {
                        field.onChange(e)
                        handleCurrencyCodeChange(e.target.value, setValue)
                      }}
                    >
                      {Object.entries(CURRENCY_DATA).map(([code, info]) => (
                        <MenuItem key={code} value={code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{info.flag}</span>
                            <span>{code} - {info.name}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Currency name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Currency Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="symbol"
                control={control}
                rules={{ required: 'Currency symbol is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Currency Symbol"
                    error={!!errors.symbol}
                    helperText={errors.symbol?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="rate"
                control={control}
                rules={{ required: 'Exchange rate is required', min: { value: 0.01, message: 'Rate must be greater than 0' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Exchange Rate"
                    type="number"
                    inputProps={{ step: 0.01, min: 0.01 }}
                    error={!!errors.rate}
                    helperText={errors.rate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="format"
                control={control}
                rules={{ required: 'Currency format is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Currency Format"
                    placeholder="$1,000.00"
                    error={!!errors.format}
                    helperText={errors.format?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Set as Default Currency"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Add'} Currency
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Currency Settings
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="ri-add-line" />}
              onClick={handleAddCurrency}
            >
              Add New Currency
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Exchange rate is calculated from your default currency.</strong> You can change the default currency in App Settings.
            </Typography>
          </Alert>
        </Box>

        <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Currency Name</TableCell>
                <TableCell>Currency Symbol</TableCell>
                <TableCell>Currency Code</TableCell>
                <TableCell>Exchange Rate</TableCell>
                <TableCell>Currency Format</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading currencies...
                  </TableCell>
                </TableRow>
              ) : paginatedCurrencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No currencies found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCurrencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{CURRENCY_DATA[currency.code]?.flag || '💱'}</span>
                        <span>{currency.name}</span>
                        {currency.isDefault && (
                          <Chip label="Default" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{currency.symbol}</TableCell>
                    <TableCell>{currency.code}</TableCell>
                    <TableCell>{currency.rate}</TableCell>
                    <TableCell>{currency.format}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <ActionBtn
                        mainButtonText="Edit"
                        mainButtonIcon="ri-edit-line"
                        mainButtonProps={{
                          onClick: () => handleEditCurrency(currency)
                        }}
                        options={[
                          {
                            text: 'Delete',
                            icon: 'ri-delete-bin-line',
                            menuItemProps: {
                              onClick: () => handleDeleteCurrency(currency),
                              className: 'flex items-center gap-2 text-textSecondary',
                              disabled: currency.isDefault
                            }
                          }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={currencies.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        {/* Add Currency Dialog */}
        <AddEditDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          title="Add New Currency"
        />

        {/* Edit Currency Dialog */}
        <AddEditDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          title="Edit Currency"
          isEdit
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Currency</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the currency "{currencyToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default CurrencySettings