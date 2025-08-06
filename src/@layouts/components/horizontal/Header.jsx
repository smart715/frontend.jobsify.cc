// Third-party Imports
import classnames from 'classnames'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Component Imports
import NavToggle from './NavToggle'
import NavbarContent from './NavbarContent'
import { useSession } from 'next-auth/react'
import { Button } from '@mui/material'

// Styled Component Imports
import StyledHeader from '@layouts/styles/horizontal/StyledHeader'

const Header = props => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()

  // Vars
  const { navbarContentWidth } = settings
  const headerFixed = themeConfig.navbar.type === 'fixed'
  const headerStatic = themeConfig.navbar.type === 'static'
  const headerBlur = themeConfig.navbar.blur === true
  const headerContentCompact = navbarContentWidth === 'compact'
  const headerContentWide = navbarContentWidth === 'wide'

  const { data: session } = useSession()

  const handleStopImpersonation = async () => {
    try {
      const response = await fetch('/api/stop-impersonation', {
        method: 'POST'
      })

      if (response.ok) {
        window.location.href = '/en/companies'
      } else {
        console.error('Failed to stop impersonation')
      }
    } catch (error) {
      console.error('Error stopping impersonation:', error)
    }
  }

  return (
    <StyledHeader
      overrideStyles={overrideStyles}
      className={classnames(horizontalLayoutClasses.header, {
        [horizontalLayoutClasses.headerFixed]: headerFixed,
        [horizontalLayoutClasses.headerStatic]: headerStatic,
        [horizontalLayoutClasses.headerBlur]: headerBlur,
        [horizontalLayoutClasses.headerContentCompact]: headerContentCompact,
        [horizontalLayoutClasses.headerContentWide]: headerContentWide
      })}
    >
      <div className='navbar-content-container'>
        <div className='navbar-left-content'>
          <NavToggle />
        </div>
        {session?.user?.isImpersonating && (
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-warning-main">
              Impersonating: {session.user.companyName}
            </span>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={handleStopImpersonation}
              sx={{ minWidth: 'auto' }}
            >
              Stop
            </Button>
          </div>
        )}
        <NavbarContent />
      </div>
    </StyledHeader>
  )
}

export default Header