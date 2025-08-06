'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import { useTheme, styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import {
  Card, CardHeader, CardContent, Typography,
} from '@mui/material'

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
  backgroundColor: 'var(--mui-palette-background-paper)',
  maxHeight: '200px',
  overflow: 'auto'
}))


const Sidebar = ({ content }) => {
  // State to track which accordion is expanded
  const [expanded, setExpanded] = useState(null)

  const handleChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{xs: 12}}>
        <Card>
          <CardContent>
          {content?.relatedScripture?.map((scripture, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
            >
              <AccordionSummary>
                <Typography variant='h6' fontWeight={600}>
                  {scripture.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div dangerouslySetInnerHTML={{ __html: scripture.content }} />
              </AccordionDetails>
            </Accordion>
          ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Sidebar
