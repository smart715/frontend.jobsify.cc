'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, styled } from '@mui/material/styles'

import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import DirectionalIcon from '@components/DirectionalIcon'


// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})


// Styled component for Accordion component
export const Accordion = styled(MuiAccordion)({
  boxShadow: 'none !important',
  border: '1px solid var(--mui-palette-divider) !important',
  borderRadius: 'var(--mui-shape-borderRadius) !important',
  overflow: 'hidden',
  background: 'none',
  '&:not(:last-of-type)': {
    borderBottom: '0 !important'
  },
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: 'auto'
  },
  '&:first-of-type': {
    borderTopLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderTopRightRadius: 'var(--mui-shape-borderRadius) !important'
  },
  '&:last-of-type': {
    borderBottomLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderBottomRightRadius: 'var(--mui-shape-borderRadius) !important'
  }
})

// Styled component for AccordionSummary component
export const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  marginBottom: -1,
  padding: theme.spacing(3, 5),
  transition: 'min-height 0.15s ease-in-out',
  borderBottom: '1px solid var(--mui-palette-divider) !important',
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: '12px 0'
  }
}))

// Styled component for AccordionDetails component
export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)} !important`,
  backgroundColor: 'var(--mui-palette-background-paper)'
}))


const Details = ({ data }) => {
  // Hooks
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [completedSection, setCompletedSection] = useState(true);

  const [expanded, setExpanded] = useState({
    businessSetup: true,
    menu: true,
    employees: true,
    scheduleTeam: true,
    outStage: true
  })

  const [expandedGroup, setExpandedGroup] = useState({
    getHardware: true,
    addMenu: true,
    manageTeam: true,
    prepareGoLive: true,
    engageGuests: true
  })
  
  const handleChange = panel => (event, isExpanded) => {
    setExpanded({...expanded, [panel]: isExpanded})
  }

  const handleChangeGroup = panel => () => {
    setExpandedGroup({...expandedGroup, [panel]: !expandedGroup[panel]})
  }

  return (
    <div>
      <Accordion expanded={expanded.businessSetup} onChange={handleChange('businessSetup')}>
        <AccordionSummary
          id='customized-panel-header-1'
          aria-controls={'sd'}
        >
          <div className='flex items-center'>
            <i className='ri-checkbox-circle-fill text-primary me-2' />
            <Typography variant='h5' className='font-bold'>Welcome E-Mail</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={6} className='m-2'>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className='flex items-center mb-2'>
                <Typography variant='body2'>New account welcome email delivered when an account is created by the customer or the detailer</Typography>
              </div>
              <div className='mb-2'>
                <Typography variant='bold' className='font-bold'>Delivery:</Typography>
                <div className='flex items-center'>
                  <Switch disabled />
                  <Typography variant='body2'>Send SMS</Typography>
                </div>
                <div className='flex items-center'>
                  <Switch />
                  <Typography variant='body2'>Send E-Mail</Typography>
                </div>
              </div>
              <div className='mb-2'>
                <Typography variant='bold' className='font-bold'>Message:</Typography>
                <div>
                  <RadioGroup
                    aria-labelledby='name-radio-buttons-group'
                    className='items-start'
                  >
                    <FormControlLabel value='Default' control={<Radio />} label='Default' />
                    <FormControlLabel value='Alternate' control={<Radio />} label='Alternate' />
                  </RadioGroup>
                </div>
              </div>
              <div className='flex items-center mb-2'>
              <Typography variant='body2'><Typography variant='span' fontWeight='bold'>Ignores delivery window:</Typography>This notification is sent at all times of day in response to customer interactions.</Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className='bg-[--mui-palette-secondary-lighterOpacity] text-[12px] p-5 rounded-lg h-[100%]'>
                <Typography variant='body1' className='font-bold'>Subject:</Typography>
                <Typography className='text-[12px]'>Account Created With NSL Solutions</Typography>
                <Typography variant='body1' className='font-bold mt-4'>Message:</Typography>
                <Typography className='text-[12px]'>Welcome Somebody,</Typography>
                <Typography className='text-[12px]'>Thanks for choosing NSL Solutions!</Typography>
                <Typography className='text-[12px]'>Visit our website to manage your account or view invoice history!</Typography>
                <Typography className='text-[12px]'>https://dtlr.cc/VIw6O</Typography>
                <Typography className='text-[12px]'>We look forward to serving you!</Typography>
              </div>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Details
