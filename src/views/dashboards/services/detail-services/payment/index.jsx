"use client";

import { useState } from 'react';

import Link from 'next/link';

import Grid from '@mui/material/Grid2';
import {
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  Switch
} from '@mui/material';
import { RiArrowRightLine } from 'react-icons/ri';

const PaymentTab = () => {
  const [stripeEnabled, setStripeEnabled] = useState(false);

  const [formData, setFormData] = useState({
    country: '',
    currency: '',
  });

  return (
    <Grid container spacing={10} sx={{ mt: 3 }}>
      <Grid size={{ xs:12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Payment Processors</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{ padding: '10px' }}>
                <Grid size={{ xs:12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={stripeEnabled}
                    onChange={(e) => setStripeEnabled(e.target.checked)}
                  />
                  <Divider orientation='vertical' flexItem />
                  <Typography variant='h5'>Stripe Connect</Typography>
                </Grid>

                {stripeEnabled && (
                  <>
                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>Connect (Live)</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Link href='/' className='btn linkj items-center flex'>
                        Start Connecting <RiArrowRightLine />
                      </Link>
                    </Grid>

                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>Connect (Dev)</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Link href='/' className='btn linkj items-center flex'>
                        Start Connecting <RiArrowRightLine />
                      </Link>
                    </Grid>

                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>Other Settings</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs:12, sm: 6 }}>
                          <FormControl fullWidth>
                            <InputLabel>Country</InputLabel>
                            <Select
                              label='Country'
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            >
                              <MenuItem value='Australia'>Australia</MenuItem>
                              <MenuItem value='Austria'>Austria</MenuItem>
                              <MenuItem value='Poland'>Poland</MenuItem>
                              <MenuItem value='United States'>United States</MenuItem>
                              <MenuItem value='Germany'>Germany</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, sm: 6 }}>
                          <FormControl fullWidth>
                            <InputLabel>Currency Code</InputLabel>
                            <Select
                              label='Currency Code'
                              value={formData.currency}
                              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                              <MenuItem value='AUD'>Australian Dollar (AUD)</MenuItem>
                              <MenuItem value='USD'>United States Dollar (USD)</MenuItem>
                              <MenuItem value='EUR'>Euro (EUR)</MenuItem>
                              <MenuItem value='PLN'>Polish Zloty (PLN)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  );
};

export default PaymentTab;
