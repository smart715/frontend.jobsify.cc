// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import SendInvoiceDrawer from '@views/billing/shared/SendInvoiceDrawer'

const PreviewActions = ({ invoiceData, id }) => {
  // Vars
  const SendButtonProps = {
    variant: 'contained',
    children: 'Send Invoice',
    size: 'small',
    startIcon: <i className="ri-send-plane-line" />,
    fullWidth: true,
    className: 'is-full sm:is-auto',
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 12 }}>
        <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{
                ...SendButtonProps,
                className: 'is-full',
              }}
              dialog={SendInvoiceDrawer}
              dialogProps={{ invoiceData }}
            />
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              className="is-full"
              startIcon={<i className="ri-download-line" />}
              onClick={() => window.print()}
            >
              Download
            </Button>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              className="is-full"
              startIcon={<i className="ri-printer-line" />}
              onClick={() => window.print()}
            >
              Print
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PreviewActions
