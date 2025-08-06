
'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const NavToggle = () => {
  // Hooks
  const { settings, updateSettings } = useSettings()

  // Vars
  const { layout } = settings

  const handleToggle = () => {
    if (layout === 'vertical') {
      updateSettings({ isNavCollapsed: !settings.isNavCollapsed })
    } else {
      updateSettings({ isNavCollapsed: !settings.isNavCollapsed })
    }
  }

  return (
    <IconButton
      className={classnames('text-textPrimary')}
      onClick={handleToggle}
      size='small'
    >
      <i className='tabler-menu-2 text-xl' />
    </IconButton>
  )
}

export default NavToggle
