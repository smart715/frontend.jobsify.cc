// React Imports
import { cloneElement, createElement, forwardRef } from 'react'

// Third-party Imports
import classnames from 'classnames'
import { css } from '@emotion/react'

// Component Imports
import { RouterLink } from '../RouterLink'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'

export const menuButtonStyles = props => {
  // Props
  const { level, disabled, children, isCollapsed, isPopoutWhenCollapsed } = props

  return css({
    display: 'flex',
    alignItems: 'center',
    minBlockSize: '30px',
    textDecoration: 'none',
    color: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    paddingInlineEnd: '20px',
    paddingInlineStart: `${level === 0 ? 20 : (isPopoutWhenCollapsed && isCollapsed ? level : level + 1) * 20}px`,
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: '#f3f3f3'
    },
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: '#f3f3f3'
    },
    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: '#adadad'
    }),

    // All the active styles are applied to the button including menu items or submenu
    [`&.${menuClasses.active}`]: {
      ...(!children && { color: 'white' }),
      backgroundColor: children ? '#f3f3f3' : '#765feb'
    }
  })
}

const MenuButton = ({ className, component, children, ...rest }, ref) => {
  if (component) {
    if (typeof component === 'string') {
      return createElement(
        component,
        {
          className: classnames(className),
          ...rest,
          ref
        },
        children
      )
    } else {
      const { className: classNameProp, ...props } = component.props

      return cloneElement(
        component,
        {
          className: classnames(className, classNameProp),
          ...rest,
          ...props,
          ref
        },
        children
      )
    }
  } else if (rest.href && rest.href !== '') {
    return (
      <RouterLink ref={ref} className={className} href={rest.href} {...rest}>
        {children}
      </RouterLink>
    )
  } else {
    const { href, ...restWithoutHref } = rest

    return (
      <div ref={ref} className={className} {...restWithoutHref}>
        {children}
      </div>
    )
  }
}

export default forwardRef(MenuButton)
