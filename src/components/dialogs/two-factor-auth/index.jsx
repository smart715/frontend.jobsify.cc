'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import { IMaskInput } from 'react-imask'
import { forwardRef } from 'react'

// Component Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import DirectionalIcon from '@components/DirectionalIcon'

// Custom Phone Input Component
const PhoneNumberInput = forwardRef((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

PhoneNumberInput.displayName = 'PhoneNumberInput'

// Vars
const data = [
  {
    title: (
      <div className='flex items-center gap-1'>
        <i className='ri-settings-3-line text-textPrimary text-xl' />
        <Typography className='font-medium' color='text.primary'>
          Authenticator Apps
        </Typography>
      </div>
    ),
    value: 'app',
    isSelected: true,
    content: 'Get code from an app like Google Authenticator or Microsoft Authenticator.'
  },
  {
    title: (
      <div className='flex items-center gap-1'>
        <i className='ri-wechat-line text-textPrimary text-xl' />
        <Typography className='font-medium' color='text.primary'>
          SMS
        </Typography>
      </div>
    ),
    value: 'sms',
    content: 'We will send a code via SMS if you need to use your backup login method.'
  }
]

const SMSDialog = ({ handleAuthDialogClose, onSuccess, companyId, companyData }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const { data: session } = useSession()

  // Pre-fill company phone number when dialog opens
  useEffect(() => {
    if (companyData?.companyPhone) {
      setPhoneNumber(companyData.companyPhone)
    }
  }, [companyData])

  // Reset state when dialog opens
  useEffect(() => {
    setVerificationCode('')
    setIsCodeSent(false)
    setError('')
    setIsVerified(false)
  }, [])

  const sendSMSCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-sms-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          userId: session.user.id,
          companyId: companyId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsCodeSent(true)
      } else {
        setError(data.error || 'Failed to send SMS code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifySMSCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-sms-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          code: verificationCode,
          userId: session.user.id,
          companyId: companyId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setError('')
        setTimeout(() => {
          onSuccess?.()
          handleAuthDialogClose()
        }, 2000) // Show success message for 2 seconds
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogTitle variant='h5' className='flex flex-col items-start gap-2 sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%]'>
          {isCodeSent ? 'Verify SMS Code' : 'Setup SMS Authentication'}
        </div>
        <Typography component='span' className='flex flex-col'>
          {isCodeSent 
            ? `Enter the 6-digit code sent to ${phoneNumber}`
            : 'Enter your mobile phone number with country code and we will send you a verification code.'
          }
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pbe-6 sm:pli-16'>
        <IconButton className='absolute block-start-4 inline-end-4' onClick={handleAuthDialogClose}>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>

        {error && (
          <Alert severity="error" className='mb-4'>
            {error}
          </Alert>
        )}

        {isVerified && (
          <Alert severity="success" className='mb-4'>
            SMS verification successful!
          </Alert>
        )}

        {!isCodeSent ? (
          <TextField 
            fullWidth 
            type='tel' 
            label='Mobile Number' 
            placeholder='(123) 456-7890'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            InputProps={{
              inputComponent: PhoneNumberInput,
            }}
          />
        ) : (
          <TextField 
            fullWidth 
            type='text' 
            label='Verification Code' 
            placeholder='123456'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
            inputProps={{ maxLength: 6 }}
          />
        )}
      </DialogContent>
      <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' type='reset' color='secondary' onClick={handleAuthDialogClose}>
          Cancel
        </Button>
        <Button
          color='success'
          variant='contained'
          type='submit'
          disabled={isLoading}
          onClick={isCodeSent ? verifySMSCode : sendSMSCode}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isCodeSent ? 'Verify Code' : 'Send Code'}
        </Button>
      </DialogActions>
    </>
  )
}

const AppDialog = ({ handleAuthDialogClose, onSuccess, companyId, userEmail }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/generate-totp-secret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: userEmail || session?.user?.email,
          companyId: companyId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl)
        setSecret(data.secret)
      } else {
        setError(data.error || 'Failed to generate QR code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTOTPCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-totp-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          secret: secret,
          userId: session.user.id,
          companyId: companyId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setError('')
        setTimeout(() => {
          onSuccess?.()
          handleAuthDialogClose()
        }, 2000) // Show success message for 2 seconds
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogTitle variant='h4' className='flex justify-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Add Authenticator App</div>
      </DialogTitle>
      <DialogContent className='flex flex-col gap-6 pbs-0 sm:pbe-6 sm:pli-16'>
        <IconButton className='absolute block-start-4 inline-end-4' onClick={handleAuthDialogClose}>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {isVerified && (
          <Alert severity="success">
            Authenticator App verification successful!
          </Alert>
        )}

        <div className='flex flex-col gap-2'>
          <Typography variant='h5'>Authenticator Apps</Typography>
          <Typography>
            Using an authenticator app like Google Authenticator, Microsoft Authenticator, Authy, or 1Password, scan the
            QR code. It will generate a 6 digit code for you to enter below.
          </Typography>
        </div>

        <div className='flex justify-center'>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
              <CircularProgress />
            </Box>
          ) : qrCodeUrl ? (
            <img alt='qr-code' src={qrCodeUrl} width={200} height={200} />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
              <Typography color="error">Failed to load QR code</Typography>
            </Box>
          )}
        </div>

        <div className='flex flex-col gap-4'>
          {secret && (
            <Alert severity='warning' icon={false}>
              <AlertTitle>{secret}</AlertTitle>
              If you having trouble using the QR code, select manual entry on your app
            </Alert>
          )}
          <TextField 
            fullWidth 
            label='Enter Authentication Code' 
            placeholder='Enter Authentication Code'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
            inputProps={{ maxLength: 6 }}
          />
        </div>
      </DialogContent>
      <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' type='reset' color='secondary' onClick={handleAuthDialogClose}>
          Cancel
        </Button>
        <Button
          color='success'
          variant='contained'
          type='submit'
          disabled={isLoading || !verificationCode}
          onClick={verifyTOTPCode}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Verify & Enable
        </Button>
      </DialogActions>
    </>
  )
}

const TwoFactorAuth = ({ open, setOpen, onSuccess, companyId, userEmail, companyData }) => {
  // Vars
  const initialSelectedOption = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [authType, setAuthType] = useState(initialSelectedOption)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleClose = () => {
    setOpen(false)

    if (authType !== 'app') {
      setAuthType('app')
    }
  }

  const handleAuthDialogClose = () => {
    setShowAuthDialog(false)

    if (authType !== 'app') {
      setTimeout(() => {
        setAuthType('app')
      }, 250)
    }
  }

  const handleOptionChange = prop => {
    if (typeof prop === 'string') {
      setAuthType(prop)
    } else {
      setAuthType(prop.target.value)
    }
  }

  const handleSuccess = () => {
    // Refresh the page or trigger a re-fetch of user data
    window.location.reload()
  }

  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition={false}
      >
        <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <div className='max-sm:is-[80%] max-sm:text-center'>Select Authentication Method</div>
          <Typography component='span' className='flex flex-col text-center'>
            You also need to select a method by which the proxy authenticates to the directory serve.
          </Typography>
        </DialogTitle>
        <DialogContent className='pbs-0 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={6}>
            {data.map((item, index) => (
              <CustomInputHorizontal
                key={index}
                type='radio'
                selected={authType}
                handleChange={handleOptionChange}
                data={item}
                gridProps={{ size: { xs: 12 } }}
                name='auth-method'
              />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
            onClick={() => {
              setOpen(false)
              setShowAuthDialog(true)
            }}
            className='capitalize'
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        open={showAuthDialog}
        onClose={handleAuthDialogClose}
        closeAfterTransition={false}
      >
        <form onSubmit={e => e.preventDefault()}>
          {authType === 'sms' ? (
            <SMSDialog handleAuthDialogClose={handleAuthDialogClose} onSuccess={handleSuccess} companyId={companyId} companyData={companyData} />
          ) : (
            <AppDialog handleAuthDialogClose={handleAuthDialogClose} onSuccess={handleSuccess} companyId={companyId} userEmail={userEmail} />
          )}
        </form>
      </Dialog>
    </>
  )
}

export default TwoFactorAuth