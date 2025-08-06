// React Imports
import { useState } from 'react'

// React Imports
// import { useState } from 'react' // No longer using initialData state

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'

// import FormControl from '@mui/material/FormControl' // Not using Selects that require this directly
import IconButton from '@mui/material/IconButton'

// import InputLabel from '@mui/material/InputLabel' // Not using Selects
// import MenuItem from '@mui/material/MenuItem' // Not using Selects
// import Select from '@mui/material/Select' // Not using Selects
import TextField from '@mui/material/TextField' // Will use this for our fields
// import FormHelperText from '@mui/material/FormHelperText' // Not using Selects
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Vars
// const initialData = { // Removed user-specific initial data
//   company: '',
//   country: '',
//   contact: ''
// }

const AddCompanyDrawer = props => { // Renamed component
  // Props
  const { open, handleClose, setData } = props // Removed userData

  // States
  // const [formData, setFormData] = useState(initialData) // Removed formData state

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { // Updated default values for company fields
      companyName: '',
      companyEmail: '', // Corrected here
      website: ''
    }
  })

  // Add a state for handling submission errors
  const [submissionError, setSubmissionError] = useState(null)

  const onSubmit = async data => {
    setSubmissionError(null) // Reset error before new submission

    // Data to be sent to the API (package and status can be added if they are part of the form)
    const companyPayload = {
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      website: data.website
      
      // package: data.package, // Example if package was in form
      // status: data.status,   // Example if status was in form
    };

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.error || `Failed to create company: ${response.status}`);
      }

      const savedCompany = await response.json();

      if (setData) {
        // Add the successfully saved company (with DB ID) to the list
        setData(prevData => [savedCompany, ...(prevData || [])]);
      }
      
      handleClose();
      resetForm({ companyName: '', companyEmail: '', website: '' }); // Reset form
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error.message);
    }
  };

  const handleReset = () => {
    handleClose()
    
    // setFormData(initialData) // Removed formData state update
    resetForm({ companyName: '', email: '', website: ''}) // Reset with new company fields
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset} // Keep onClose for user clicking away
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add New Company</Typography> {/* Changed title */}
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {submissionError && (
            <Typography color="error" role="alert">
              {submissionError}
            </Typography>
          )}
          <Controller
            name='companyName'
            control={control}
            rules={{ required: 'Company name is required.' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Company Name' // Changed label
                placeholder='Acme Corp' // Changed placeholder
                {...(errors.companyName && { error: true, helperText: errors.companyName.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='email'
                label='Company Email'
                placeholder='contact@acmecorp.com' // Changed placeholder
                {...(errors.companyEmail && { error: true, helperText: errors.companyEmail.message })}
              />
            )}
          />
          <Controller
            name='website' // Added website field
            control={control}
            
            // rules={{ required: true }} // Making website optional
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Website (Optional)'
                placeholder='https://acmecorp.com'
                
                // No error handling for optional field for now
              />
            )}
          />
          {/* Removed all user-specific FormControl/Select/TextFields for role, plan, status, company, country, contact */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}> {/* Changed to call handleReset */}
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddCompanyDrawer // Changed export name
