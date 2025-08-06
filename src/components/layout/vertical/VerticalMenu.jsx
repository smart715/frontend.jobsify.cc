// Next Imports
import { useParams } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography' // For error message

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import { GenerateVerticalMenu } from '@components/GenerateMenu'
import { appMenuConfig, detailedMenuDefinitions } from '../../../data/navigation/appMenuConfig.js'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { data: session } = useSession()

  // *** Add validation for dictionary ***
  if (!dictionary || !dictionary.navigation) {
    console.error("VerticalMenu: Dictionary or dictionary.navigation is undefined. Cannot render menu.", dictionary);


    // Optionally, render a fallback UI or null

    return <Typography color="error" sx={{ p: 2 }}>Menu dictionary not loaded correctly.</Typography>;

  }

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const userRole = session?.user?.role

  let menuContent;

  if (userRole === 'ADMIN') {
    const adminMenuProps = {
      locale,
      dictionary,
      verticalNavOptions,
      theme,
      Menu,
      SubMenu,
      MenuItem,
      MenuSection,
      RenderExpandIcon,
      menuItemStyles,
      menuSectionStyles,
      transitionDuration
    };

    menuContent = appMenuConfig.ADMIN(adminMenuProps);

  } else if (userRole === 'SUPER_ADMIN') {
    const superAdminMenuProps = {
      locale,
      dictionary,
      verticalNavOptions,
      theme,
      Menu,
      SubMenu,
      MenuItem,
      MenuSection,
      RenderExpandIcon,
      menuItemStyles,
      menuSectionStyles,
      transitionDuration
    };

    menuContent = appMenuConfig.SUPER_ADMIN(superAdminMenuProps);

  } else {
    let roleSpecificLabels = [];

    if (userRole === 'SUPPLIER') {
      roleSpecificLabels = appMenuConfig.SUPPLIER_LABELS;
    } else if (userRole === 'EMPLOYEE') {
      roleSpecificLabels = appMenuConfig.EMPLOYEE_LABELS;
    } else if (userRole === 'STAFF') {
      roleSpecificLabels = appMenuConfig.STAFF_LABELS;
    } else {
      // Fallback for roles not explicitly defined in appMenuConfig LABELS
      // or if userRole is undefined/null initially
      roleSpecificLabels = []; 
    }

    const menuDataForRole = roleSpecificLabels.map(labelKey => {
      const definition = detailedMenuDefinitions[labelKey];

      if (!definition) {
        console.warn(`VerticalMenu: No detailed definition found for labelKey: ${labelKey}`);
        return null;
      }

      const { labelKey: mainLabelKey, ...rest } = definition;

      const buildChildren = (childrenKeys) => {
        if (!childrenKeys || childrenKeys.length === 0) return undefined;

        return childrenKeys.map(childKey => {
          const childDef = detailedMenuDefinitions[childKey];

          if (!childDef) {
            console.warn(`VerticalMenu: No detailed definition found for child labelKey: ${childKey}`);
            return null;
          }

          const { labelKey: childLabelKey, ...childRest } = childDef;

          return {
            ...childRest,
            label: dictionary.navigation[childLabelKey] || childLabelKey,
            icon: childRest.icon ? <i className={childRest.icon} /> : undefined,
            children: buildChildren(childDef.children)
          };
        }).filter(Boolean);
      };

      return {
        ...rest,
        label: dictionary.navigation[mainLabelKey] || mainLabelKey,
        icon: rest.icon ? <i className={rest.icon} /> : undefined,
        children: buildChildren(definition.children)
      };
    }).filter(Boolean);

    menuContent = (
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuDataForRole} params={params} dictionary={dictionary} />
      </Menu>
    );
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {menuContent}
    </ScrollWrapper>
  )
}

export default VerticalMenu