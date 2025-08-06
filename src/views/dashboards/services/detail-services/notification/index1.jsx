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
  Switch,
  TextField
} from '@mui/material';

const NotificationTab = () => {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const [formData, setFormData] = useState({
    fromName: '',
    fromEmail: '',
    smsPhone: '',
    smsSid: '',
    smsToken: '',
    waPhoneId: '',
    waBusinessId: '',
    waAccessToken: '',
  });
  
  return (
    <Grid container spacing={10} sx={{ mt: 3 }}>
      <Grid size={{ xs:12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Email Processors</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{ padding: '10px' }}>
                <Grid size={{ xs:12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                  />
                  <Divider orientation='vertical' flexItem />
                  <Typography variant='h5'>Default Mailer</Typography>
                </Grid>

                {emailEnabled && (
                  <>
                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>Email Settings</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs:12, sm: 6 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='From Name'
                              value={formData.fromName}
                              onChange={e => setFormData({ ...formData, fromName: e.target.value })}
                            />
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs:12, sm: 6 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='From Email Address'
                              value={formData.fromEmail}
                              onChange={e => setFormData({ ...formData, fromEmail: e.target.value })}
                            />
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
      <Grid size={{ xs:12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>SMS Processors</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{ padding: '10px' }}>
                <Grid size={{ xs:12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                  />
                  <Divider orientation='vertical' flexItem />
                  <Typography variant='h5'>Twillo</Typography>
                </Grid>

                {smsEnabled && (
                  <>
                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>Sender</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Phone Number'
                          value={formData.smsPhone}
                          onChange={e => setFormData({ ...formData, smsPhone: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>API Credentials</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs:12 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='Account SID'
                              value={formData.smsSid}
                              onChange={e => setFormData({ ...formData, smsSid: e.target.value })}
                            />
                          </FormControl>
                        </Grid>

                        <Grid size={{ xs:12 }}>
                          <FormControl fullWidth>
                            <TextField
                              type="password"
                              label='Auth Token'
                              value={formData.smsToken}
                              onChange={e => setFormData({ ...formData, smsToken: e.target.value })}
                            />
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
      <Grid size={{ xs:12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>WhatsApp Processors</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{ padding: '10px' }}>
                <Grid size={{ xs:12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Switch
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  />
                  <Divider orientation='vertical' flexItem />
                  <Typography variant='h5'>WhatsApp</Typography>
                </Grid>

                {whatsappEnabled && (
                  <>
                    <Grid size={{ xs:12 }}>
                      <Divider />
                    </Grid>
                    <Grid size={{ xs:3 }}>
                      <Typography variant='body2'>API Credentials</Typography>
                    </Grid>
                    <Grid size={{ xs:9 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs:12, sm: 3 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='Phone Number ID'
                              value={formData.waPhoneId}
                              onChange={e => setFormData({ ...formData, waPhoneId: e.target.value })}
                            />
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs:12, sm: 3 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='Business Account ID'
                              value={formData.waBusinessId}
                              onChange={e => setFormData({ ...formData, waBusinessId: e.target.value })}
                            />
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs:12, sm: 6 }}>
                          <FormControl fullWidth>
                            <TextField
                              label='System User Access Token'
                              value={formData.waAccessToken}
                              onChange={e => setFormData({ ...formData, waAccessToken: e.target.value })}
                            />
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

export default NotificationTab;
