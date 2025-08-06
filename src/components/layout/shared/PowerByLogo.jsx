'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Component Imports
import PowerLogo from '@core/svg/PowerByLogo'
import PowerByLogoDark from '@/@core/svg/PowerByLogoDark'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const PowerByLogo = (props) => {
  const { isDark } = props

  // Refs (no TS‐generic here)
  const logoTextRef = useRef(null) 

  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') return

    if (logoTextRef.current) {
      if (!isBreakpointReached && !isHovered) {
        logoTextRef.current.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  if (layout === 'collapsed') return null

  return (
    <div className='flex items-center w-full' ref={logoTextRef}>
      {isDark ? (
        <PowerByLogoDark
          className='text-2xl text-primary'
          style={{ height: '48px', width: '100%' }}
        />
      ) : (
        <PowerLogo
          className='text-2xl text-primary'
          style={{ height: '48px', width: '100%' }}
        />
      )}
    </div>
  )
}

export default PowerByLogo
