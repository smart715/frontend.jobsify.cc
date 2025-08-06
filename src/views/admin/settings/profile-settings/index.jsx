'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

const ProfileSettings = () => {
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    language: 'english',
    emailNotifications: 'yes',
    image: ''
  })

  // Crop functionality state
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [crop, setCrop] = useState({ aspect: 1, x: 0, y: 0, width: 100, height: 100 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageRef, setImageRef] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const fetchUserData = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/super-admins/${session.user.id}`)

      if (response.ok) {
        const data = await response.json()
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          password: '',
          language: 'english',
          emailNotifications: 'yes',
          image: data.image || ''
        })
      } else {
        toast.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Error loading user data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('userId', session.user.id)

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(prev => ({ ...prev, image: data.imageUrl }))
        toast.success('Profile image updated successfully!')
        return data.imageUrl
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/super-admins/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          image: userData.image,
          ...(userData.password && {
            currentPassword: userData.currentPassword,
            newPassword: userData.password,
          }),
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            image: userData.image,
          }
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    fetchUserData()
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
    }
  }, [session])

  if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className="flex justify-center items-center min-h-96">
              <CircularProgress />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setOriginalFile(file)
      // Create preview URL for cropping
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onImageLoad = (e) => {
    setImageRef(e.currentTarget)
  }

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9)
    })
  }

  const handleCropComplete = async () => {
    if (imageRef && completedCrop) {
      try {
        const croppedImageBlob = await getCroppedImg(imageRef, completedCrop)

        // Create cropped file
        const croppedFile = new File([croppedImageBlob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        })

        setUserData(prev => ({...prev, image: URL.createObjectURL(croppedFile)}))
        setOriginalFile(null)

        // Create preview URL for cropped image
        const reader = new FileReader()
        reader.onloadend = () => {
        }
        setCropModalOpen(false)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  const handleCropCancel = () => {
    setCropModalOpen(false)
    setImageSrc('')
    setOriginalFile(null)
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

   const handleUploadClick = () => {
    document.querySelector('input[type="file"]').click();
  };


  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='h4'>Profile Settings</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <div className='flex flex-col sm:flex-row items-center gap-6'>
                    <Avatar 
                      className='w-24 h-24'
                      src={userData.image}
                    >
                      {userData.image ? null : (
                        userData.firstName || userData.lastName ? 
                          getInitials(userData.firstName, userData.lastName) : 
                          <i className='ri-user-line text-4xl' />
                      )}
                    </Avatar>
                    <div className='flex flex-grow flex-col gap-4'>
                      <div className='flex flex-col sm:flex-row gap-4'>
                        <Button component='label' size='small' variant='contained' onClick={handleUploadClick}>
                          Upload Photo
                          <input type='file' hidden onChange={handleAvatarChange}/>
                        </Button>
                        <Button size='small' variant='outlined' color='error'  onClick={handleReset}>
                          Reset
                        </Button>
                      </div>
                      <Typography variant='body2' className='text-textDisabled'>
                        Allowed JPG, PNG or GIF. Max size 2MB
                      </Typography>
                    </div>
                  </div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label='First Name *' 
                    placeholder='Matt'
                    value={userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label='Last Name *' 
                    placeholder='Stroin'
                    value={userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label='Your Email *' 
                    placeholder='superadmin@example.com'
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    type="email"
                  />
                </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='New Password'
                    placeholder='Enter new password'
                    type={showPassword ? 'text' : 'password'}
                    value={userData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography>Receive email notifications?</Typography>
                  <RadioGroup 
                    row 
                    value={userData.emailNotifications} 
                    onChange={(e) => handleInputChange('emailNotifications', e.target.value)}
                    className='gap-4'
                  >
                    <FormControlLabel value='yes' control={<Radio />} label='Enable' />
                    <FormControlLabel value='no' control={<Radio />} label='Disable' />
                  </RadioGroup>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <div className='flex gap-4'>
                    <Button 
                      variant='contained' 
                      type='submit'
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <i className="ri-save-line" />}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      variant='outlined' 
                      type='button' 
                      color='secondary'
                      onClick={handleReset}
                      disabled={saving}
                    >
                      Reset
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={cropModalOpen} onClose={handleCropCancel} maxWidth='sm' fullWidth>
        <DialogTitle>Crop Profile Photo</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={100}
                minHeight={100}
                keepSelection
              >
                <img
                  src={imageSrc}
                  onLoad={onImageLoad}
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                  alt="Crop preview"
                />
              </ReactCrop>
            )}
          </div>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Drag to select the area you want to crop. The image will be cropped to a square format.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel}>Cancel</Button>
          <Button onClick={handleCropComplete} variant='contained'>
            Crop
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ProfileSettings