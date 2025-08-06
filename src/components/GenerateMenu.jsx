'use client'

// React Imports
import { Fragment } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import { Menu as HorizontalMenu, SubMenu as HorizontalSubMenu, MenuItem as HorizontalMenuItem } from '@menu/horizontal-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { confirmUrlInChildren } from '@menu/utils/menuUtils'

const GenerateVerticalMenu = ({ menuData, renderExpandIcon, renderExpandedMenuItemIcon, menuItemStyles, isBreakpointReached }) => {
  // Hooks
  const pathname = usePathname()
  const { isCollapsed, isHovered, isPopoutWhenCollapsed } = useVerticalNav()

  // Helper function to check if URL matches
  const isUrlActive = (href, exactMatch, activeUrl) => {
    if (!href) return false

    // Remove language prefix for comparison
    const cleanPathname = pathname.replace(/^\/[a-z]{2}\//, '/')
    const cleanHref = href.replace(/^\/[a-z]{2}\//, '/')

    if (exactMatch === false && activeUrl) {
      const cleanActiveUrl = activeUrl.replace(/^\/[a-z]{2}\//, '/')
      return cleanPathname.includes(cleanActiveUrl) || pathname.includes(activeUrl)
    }

    return cleanPathname === cleanHref || pathname === href
  }

  // Helper function to check if any child is active
  const hasActiveChild = (children) => {
    if (!children) return false

    return children.some(child => {
      if (child.href && isUrlActive(child.href, child.exactMatch, child.activeUrl)) {
        return true
      }
      if (child.children) {
        return hasActiveChild(child.children)
      }
      return false
    })
  }

  const renderMenuItems = (data, level = 0) => {
    return data?.map((item, index) => {
      const { label, icon, href, children, disabled, isSection, exactMatch, activeUrl, ...rest } = item

      const isActive = isUrlActive(href, exactMatch, activeUrl)
      const childActive = hasActiveChild(children)

      if (isSection) {
        return (
          <MenuSection key={index} label={label} {...rest}>
            {children && renderMenuItems(children, level + 1)}
          </MenuSection>
        )
      }

      if (children) {
        return (
          <SubMenu
            key={index}
            label={label}
            icon={icon}
            level={level}
            disabled={disabled}
            renderExpandIcon={renderExpandIcon}
            renderExpandedMenuItemIcon={renderExpandedMenuItemIcon}
            menuItemStyles={menuItemStyles}
            rootStyles={{
              ['& > .menu-button']: {
                ...(childActive && {
                  backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                  color: 'var(--mui-palette-primary-main)',
                  '& .menu-icon': {
                    color: 'var(--mui-palette-primary-main)'
                  }
                })
              }
            }}
            {...rest}
          >
            {renderMenuItems(children, level + 1)}
          </SubMenu>
        )
      }

      return (
        <MenuItem
          key={index}
          label={label}
          icon={icon}
          href={href}
          level={level}
          disabled={disabled}
          exactMatch={exactMatch}
          activeUrl={activeUrl}
          renderExpandedMenuItemIcon={renderExpandedMenuItemIcon}
          menuItemStyles={menuItemStyles}
          rootStyles={{
            ...(isActive && {
              backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
              color: 'var(--mui-palette-primary-main)',
              '& .menu-icon': {
                color: 'var(--mui-palette-primary-main)'
              },
              '& .menu-label': {
                color: 'var(--mui-palette-primary-main)',
                fontWeight: 600
              }
            })
          }}
          {...rest}
        />
      )
    })
  }

  return <Menu menuItemStyles={menuItemStyles}>{renderMenuItems(menuData)}</Menu>
}

const GenerateHorizontalMenu = ({ menuData, renderExpandIcon, menuItemStyles }) => {
  // Hooks
  const pathname = usePathname()

  // Helper function to check if URL matches
  const isUrlActive = (href, exactMatch, activeUrl) => {
    if (!href) return false

    // Remove language prefix for comparison
    const cleanPathname = pathname.replace(/^\/[a-z]{2}\//, '/')
    const cleanHref = href.replace(/^\/[a-z]{2}\//, '/')

    if (exactMatch === false && activeUrl) {
      const cleanActiveUrl = activeUrl.replace(/^\/[a-z]{2}\//, '/')
      return cleanPathname.includes(cleanActiveUrl) || pathname.includes(activeUrl)
    }

    return cleanPathname === cleanHref || pathname === href
  }

  // Helper function to check if any child is active
  const hasActiveChild = (children) => {
    if (!children) return false

    return children.some(child => {
      if (child.href && isUrlActive(child.href, child.exactMatch, child.activeUrl)) {
        return true
      }
      if (child.children) {
        return hasActiveChild(child.children)
      }
      return false
    })
  }

  const renderMenuItems = (data, level = 0) => {
    return data?.map((item, index) => {
      const { label, icon, href, children, disabled, exactMatch, activeUrl, ...rest } = item

      const isActive = isUrlActive(href, exactMatch, activeUrl)
      const childActive = hasActiveChild(children)

      if (children) {
        return (
          <HorizontalSubMenu
            key={index}
            label={label}
            icon={icon}
            level={level}
            disabled={disabled}
            renderExpandIcon={renderExpandIcon}
            menuItemStyles={menuItemStyles}
            rootStyles={{
              ['& > .menu-button']: {
                ...(childActive && {
                  backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                  color: 'var(--mui-palette-primary-main)',
                  '& .menu-icon': {
                    color: 'var(--mui-palette-primary-main)'
                  }
                })
              }
            }}
            {...rest}
          >
            {renderMenuItems(children, level + 1)}
          </HorizontalSubMenu>
        )
      }

      return (
        <HorizontalMenuItem
          key={index}
          label={label}
          icon={icon}
          href={href}
          level={level}
          disabled={disabled}
          exactMatch={exactMatch}
          activeUrl={activeUrl}
          menuItemStyles={menuItemStyles}
          rootStyles={{
            ...(isActive && {
              backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
              color: 'var(--mui-palette-primary-main)',
              '& .menu-icon': {
                color: 'var(--mui-palette-primary-main)'
              },
              '& .menu-label': {
                color: 'var(--mui-palette-primary-main)',
                fontWeight: 600
              }
            })
          }}
          {...rest}
        />
      )
    })
  }

  return <HorizontalMenu menuItemStyles={menuItemStyles}>{renderMenuItems(menuData)}</HorizontalMenu>
}

export { GenerateVerticalMenu, GenerateHorizontalMenu }