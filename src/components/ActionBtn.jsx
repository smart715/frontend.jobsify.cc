'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Link from 'next/link'

import { useRouter } from 'next/navigation'

import Paper from '@mui/material/Paper'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { useTheme } from '@mui/material/styles'

import { Box, Divider } from '@mui/material'

const MenuItemWrapper = ({ children, option }) => {
  if (option.href) {
    return (
      <Box
        component={Link}
        href={option.href}
        {...option.linkProps}
        className="flex gap-2"
      >
        {children}
      </Box>
    )
  } else {
    return <>{children}</>
  }
}

const ActionBtn = (props) => {
  // States
  const {
    options,
    href,
    mainButtonText = 'View',
    mainButtonAction,
    mainButtonIcon,
  } = props

  const [open, setOpen] = useState(false)

  // const [setSelectedIndex] = useState<number>(0)
  const router = useRouter()

  // Hooks
  const theme = useTheme()

  // Refs
  const anchorRef = useRef(null)

  // const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
  //   setSelectedIndex(index)
  //   setOpen(false)
  // }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const handleClick = (e) => {
    if (mainButtonAction && typeof mainButtonAction === 'function') {
      mainButtonAction(e)
    } else if (href && href !== '') {
      router.push(href) // Change this to your desired path
    }
  }

  return (
    <>
      <ButtonGroup variant="tonal" ref={anchorRef} aria-label="split button">
        <Button
          variant="outlined"
          onClick={handleClick}
          startIcon={mainButtonIcon && <i className={mainButtonIcon} />}
        >
          {mainButtonText}
        </Button>
        <Button
          variant="outlined"
          className="pli-0"
          aria-haspopup="menu"
          onClick={handleToggle}
          aria-label="select merge strategy"
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'split-button-menu' : undefined}
        >
          <i className="ri-arrow-down-s-line text-[20px]" />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement="top-end"
        sx={{ zIndex: 9 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-end'
                  ? theme.direction === 'ltr'
                    ? 'right bottom'
                    : 'left bottom'
                  : theme.direction === 'rtl'
                    ? 'left bottom'
                    : 'right bottom',
            }}
          >
            <Paper className="shadow-lg">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => {
                    if (typeof option === 'string') {
                      return (
                        <MenuItem key={index} onClick={handleClose}>
                          {option}
                        </MenuItem>
                      )
                    } else if ('divider' in option) {
                      return (
                        option.divider && (
                          <Divider key={index} {...option.dividerProps} />
                        )
                      )
                    } else {
                      return (
                        <MenuItem
                          key={index}
                          {...option.menuItemProps}
                          {...(option.href && {})}
                          onClick={(e) => {
                            handleClose(e)
                            option.menuItemProps && option.menuItemProps.onClick
                              ? option.menuItemProps.onClick(e)
                              : null
                          }}
                        >
                          <MenuItemWrapper option={option}>
                            {(typeof option.icon === 'string' ? (
                              <i className={option.icon} />
                            ) : (
                              option.icon
                            )) || null}
                            {option.text}
                          </MenuItemWrapper>
                        </MenuItem>
                      )
                    }
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default ActionBtn
