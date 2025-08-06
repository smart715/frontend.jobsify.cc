'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid' // Added for potential layout needs

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const Register = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('PRIVATE'); // Default to 'PRIVATE'
  const [error, setError] = useState('') // For displaying errors

  // Hooks
  const router = useRouter() // Added for redirect
  const { settings } = useSettings()
  const { lang: locale } = useRouter()

  // Define image paths before useImageVariant
  const lightImg = '/images/pages/auth-v2-mask-2-light.png'
  const darkImg = '/images/pages/auth-v2-mask-2-dark.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  // Vars
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('') // Clear previous errors

    try {
      const response = await fetch('/api/register', { // Changed to direct path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          companyName,
          businessType
        })
      })

      const data = await response.json()

      if (response.ok && data.userId) {
        // Redirect to OTP verification page
        console.log('Registration successful, redirecting to OTP verification:', data);
        router.push(getLocalizedUrl('/pages/auth/verify-otp', locale) + `?userId=${data.userId}&purpose=REGISTRATION`);
      } else {
        // Handle errors (including case where userId might be missing from response)
        setError(data.message || 'Registration failed or unexpected response.');
        console.error('Registration failed:', data)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      console.error('An unexpected error occurred:', err)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[650px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/', locale)}
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>

        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography className='mbs-1'>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label='First Name'
              placeholder='Enter your first name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label='Last Name'
              placeholder='Enter your last name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <TextField
              fullWidth
              label='Email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={isPasswordShown ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth
              label='Company Name'
              placeholder='Enter your company name'
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Business Type</FormLabel>
              <RadioGroup
                row
                aria-label="business-type"
                name="business-type"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
              >
                <FormControlLabel value="PUBLIC" control={<Radio />} label="Public" />
                <FormControlLabel value="PRIVATE" control={<Radio />} label="Private" />
              </RadioGroup>
            </FormControl>
            {error && (
              <Typography color='error' className='mbs-1'>
                {error}
              </Typography>
            )}
            <div className='flex justify-between items-center gap-3'>
              <FormControlLabel
                control={<Checkbox />} // This can be linked to a state if terms agreement is mandatory
                label={
                  <>
                    <span>I agree to </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </Link>
                  </>
                }
              />
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Sign Up
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href='/login' color='primary.main'>
                Sign in instead
              </Typography>
            </div>
            <Divider className='gap-3 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-2'>
              <IconButton size='small' className='text-facebook'>
                <i className='ri-facebook-fill' />
              </IconButton>
              <IconButton size='small' className='text-twitter'>
                <i className='ri-twitter-fill' />
              </IconButton>
              <IconButton size='small' className='text-textPrimary'>
                <i className='ri-github-fill' />
              </IconButton>
              <IconButton size='small' className='text-googlePlus'>
                <i className='ri-google-fill' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
