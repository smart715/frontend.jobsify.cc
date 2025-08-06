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
    <div className=''>
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='primary' variant='outlined'>
              <i className='ri-circle-fill text-primary text-[15px]' />
            </TimelineDot>
            <TimelineConnector className='border-primary border-solid border-[1.5px]' />
          </TimelineSeparator>
          <TimelineContent>
            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
              <Typography variant='h4' className='font-medium' color='text.primary'>
                Getting Started: 
              </Typography>
              <Typography variant='caption' className='text-primary cursor-pointer' onClick={handleChangeGroup('getHardware')}>View less</Typography>
            </div>
            <Typography className='mbe-2'>Set your ideal start date and enter your core business information to lay the foundation.</Typography>
            {
              expandedGroup.getHardware &&
              <>
                <div className='py-2'>
                  <Accordion expanded={expanded.businessSetup} onChange={handleChange('businessSetup')}>
                    <AccordionSummary
                      id='customized-panel-header-1'
                      aria-controls={'sd'}
                    >
                      <div className='flex items-center'>
                      {/* <i className='ri-checkbox-blank-circle-line' /> */}
                        <i className='ri-checkbox-circle-fill text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Business Setup</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={6} className='m-2'>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Tell us about your timeline</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Tell us about you</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Add business contacts</Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='bg-[--mui-palette-secondary-lighterOpacity] text-[12px] p-5 rounded-lg'>
                            <Typography variant='bold' className='font-bold'>You will need:</Typography>
                            <ul className='mt-1 pl-5'>
                              <li><Typography className='text-[12px]'>Legal business name</Typography></li>
                              <li><Typography className='text-[12px]'>Federal Tax ID (FEIN)</Typography></li>
                              <li><Typography className='text-[12px]'>Owner information (including SSN)</Typography></li>
                              <li><Typography className='text-[12px]'>Business bank information</Typography></li>
                            </ul>
                          </div>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className='py-2'>
                  <div className='flex items-center w-full justify-between pr-2 border px-5 py-2 rounded-lg'>
                      <div className='flex items-center'>
                        <i className='ri-device-line text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Prepare for hardware shipment</Typography>
                      </div>
                      <Button
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                      >
                        Continue
                      </Button>
                    </div>
                </div>
              </>
            }
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant='outlined' sx={{width: '30px', height: '30px'}}>
            </TimelineDot>
            <TimelineConnector className='border-[var(--mui-palette-grey-300)] border-solid border-[1.5px]' />
          </TimelineSeparator>
          <TimelineContent>
            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
              <Typography variant='h4' className='font-medium' color='text.primary'>
                Add your menu
              </Typography>
              <Typography variant='caption' className='text-primary cursor-pointer' onClick={handleChangeGroup('addMenu')}>View less</Typography>
            </div>
            <Typography className='mbe-2'>Create a menu that works for your POS and online ordering channels.</Typography>
            {
              expandedGroup.addMenu &&
              <>
                <div className='py-2'>
                  <Accordion expanded={expanded.menu} onChange={handleChange('menu')}>
                    <AccordionSummary
                      id='customized-panel-header-1'
                      aria-controls={'sd'}
                    >
                      <div className='flex items-center w-full justify-between pr-2'>
                        <div className='flex items-center'>
                          <i className='ri-menu-line text-primary me-2' />
                          <Typography variant='h5' className='font-bold'>Menu</Typography>
                        </div>
                        <Typography >1 step left</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={6} className='m-2'>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Menu template tutorial</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Copy menu template</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-blank-circle-line text-primary me-4' />
                            <Typography variant='' className='text-primary'>Share menu</Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='bg-[--mui-palette-secondary-lighterOpacity] text-[12px] p-5 rounded-lg'>
                            <Typography variant='bold' className='font-bold'>You will need:</Typography>
                            <ul className='mt-1 pl-5'>
                              <li><Typography className='text-[12px]'>Menu structure</Typography></li>
                              <li><Typography className='text-[12px]'>Menu items</Typography></li>
                              <li><Typography className='text-[12px]'>Menu modifiers</Typography></li>
                            </ul>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12 }} className='flex justify-end'>
                          <Button
                            variant='contained'
                            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            }
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <i className='ri-checkbox-circle-fill text-primary text-[32px] my-2' />
            <TimelineConnector className='border-[var(--mui-palette-grey-300)] border-solid border-[1.5px]' />
          </TimelineSeparator>
          <TimelineContent>
            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
              <Typography variant='h4' className='font-medium' color='text.primary'>
                Manage your team
              </Typography>
              <Typography variant='caption' className='text-primary cursor-pointer' onClick={handleChangeGroup('manageTeam')}>View less</Typography>
            </div>
            <Typography className='mbe-2'>Add jobs and employees.</Typography>
            {
              expandedGroup.manageTeam &&
              <>
                <div className='py-2'>
                  <Accordion expanded={expanded.employees} onChange={handleChange('employees')}>
                    <AccordionSummary
                      id='customized-panel-header-1'
                      aria-controls={'sd'}
                    >
                      <div className='flex items-center w-full justify-between pr-2'>
                        <div className='flex items-center'>
                          <i className='ri-user-3-line text-primary me-2' />
                          <Typography variant='h5' className='font-bold'>Employees</Typography>
                        </div>
                        <Typography >1 step left</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={6} className='m-2'>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-blank-circle-line text-primary me-4' />
                            <Typography variant='' className='text-primary'>Add jobs</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Add employees</Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='bg-[--mui-palette-secondary-lighterOpacity] text-[12px] p-5 rounded-lg'>
                            <Typography variant='bold' className='font-bold'>You will need:</Typography>
                            <ul className='mt-1 pl-5'>
                              <li><Typography className='text-[12px]'>Employee information</Typography></li>
                            </ul>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12 }} className='flex justify-end'>
                          <Button
                            variant='contained'
                            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className='py-2'>
                  <div className='flex items-center w-full justify-between pr-2 border px-5 py-2 rounded-lg'>
                      <div className='flex items-center'>
                        <i className='ri-checkbox-circle-fill text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Set up Shift Review</Typography>
                      </div>
                      <Button
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                      >
                        View
                      </Button>
                    </div>
                </div>
                <div className='py-2'>
                  <Accordion expanded={expanded.scheduleTeam} onChange={handleChange('scheduleTeam')}>
                    <AccordionSummary
                      id='customized-panel-header-1'
                      aria-controls={'sd'}
                    >
                      <div className='flex items-center w-full justify-between pr-2'>
                        <div className='flex items-center'>
                          <i className='ri-book-line text-primary me-2' />
                          <Typography variant='h5' className='font-bold'>Schedule your team</Typography>
                        </div>
                        <Typography >3 steps left</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={6} className='m-2'>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='flex items-center mb-2'>
                            <i className='ri-checkbox-blank-circle-line text-primary me-4' />
                            <Typography variant='' className='text-primary'>Connect to Sling</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            <i className='ri-lock-line text-secondary me-4' />
                            <Typography variant='' className='text-secondary'>Invite your employees</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            <i className='ri-lock-line text-secondary me-4' />
                            <Typography variant='' className='text-secondary'>Publish your first schedule</Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12 }} className='flex justify-end'>
                          <Button
                            variant='contained'
                            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            }
            </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant='outlined' sx={{width: '30px', height: '30px'}}>
            </TimelineDot>
            <TimelineConnector className='border-[var(--mui-palette-grey-300)] border-solid border-[1.5px]' />
          </TimelineSeparator>
          <TimelineContent>
            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
              <Typography variant='h4' className='font-medium' color='text.primary'>
                Prepare for go-live
              </Typography>
              <Typography variant='caption' className='text-primary cursor-pointer' onClick={handleChangeGroup('prepareGoLive')}>View less</Typography>
            </div>
            <Typography className='mbe-2'>Install your hardware and prepare to take orders.</Typography>
            {
              expandedGroup.prepareGoLive &&
              <>
                <div className='py-2'>
                  <div className='flex items-center w-full justify-between pr-2 border px-5 py-2 rounded-lg'>
                      <div className='flex items-center'>
                        <i className='ri-device-line text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Install hardware</Typography>
                      </div>
                      <Button
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                      >
                        Start
                      </Button>
                    </div>
                </div>
                <div className='py-2'>
                  <Accordion expanded={expanded.outStage} onChange={handleChange('outStage')}>
                    <AccordionSummary
                      id='customized-panel-header-1'
                      aria-controls={'sd'}
                    >
                      <div className='flex items-center'>
                      {/* <i className='ri-checkbox-blank-circle-line' /> */}
                        <i className='ri-checkbox-circle-fill text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>OutStage preparedness</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={6} className='m-2'>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Payment disruption settings</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Complete manager training</Typography>
                          </div>
                          <div className='flex items-center mb-2'>
                            {/* <i className='ri-checkbox-blank-circle-line' /> */}
                            <i className='ri-checkbox-circle-fill text-primary me-4' />
                            <Typography variant='' className='text-primary'>Conduct staff training</Typography>
                          </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <div className='bg-[--mui-palette-secondary-lighterOpacity] text-[12px] p-5 rounded-lg'>
                            <Typography variant='bold' className='font-bold'>You will need:</Typography>
                            <ul className='mt-1 pl-5'>
                              <li><Typography className='text-[12px]'>Contact information of whoever will receive service disruption alerts</Typography></li>
                            </ul>
                          </div>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            }
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant='outlined' sx={{width: '30px', height: '30px'}}>
            </TimelineDot>
            <TimelineConnector className='border-[var(--mui-palette-grey-300)] border-solid border-[1.5px]' />
          </TimelineSeparator>
          <TimelineContent>
            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
              <Typography variant='h4' className='font-medium' color='text.primary'>
                Engage with your guests
              </Typography>
              <Typography variant='caption' className='text-primary cursor-pointer' onClick={handleChangeGroup('engageGuests')}>View less</Typography>
            </div>
            <Typography className='mbe-2'>Maintain and grow your customer base.</Typography>
            {
              expandedGroup.engageGuests &&
              <>
                <div className='py-2'>
                  <div className='flex items-center w-full justify-between pr-2 border px-5 py-2 rounded-lg'>
                      <div className='flex items-center'>
                        <i className='ri-refresh-line text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Activate your Loyalty Program</Typography>
                      </div>
                      <Button
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                      >
                        Start
                      </Button>
                    </div>
                </div>
                <div className='py-2'>
                  <div className='flex items-center w-full justify-between pr-2 border px-5 py-2 rounded-lg'>
                      <div className='flex items-center'>
                        <i className='ri-mail-line text-primary me-2' />
                        <Typography variant='h5' className='font-bold'>Draft your Email campaign</Typography>
                      </div>
                      <Button
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                      >
                        Start
                      </Button>
                    </div>
                </div>
              </>
            }
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <div className='flex items-center ml-8 mt-5'>
        <label className='font-medium cursor-pointer' htmlFor='customizer-semi-dark'>
          Show completed sections (1)
        </label>
        <Switch
          id='show-completed-section'
          checked={completedSection === true}
          onChange={() => setCompletedSection(!completedSection)}
        />
        <Typography>{completedSection ? 'on' : 'off'}</Typography>
      </div>
    </div>
  )
}

export default Details
