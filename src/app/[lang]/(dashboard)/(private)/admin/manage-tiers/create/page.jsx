// src/app/[lang]/(dashboard)/(private)/admin/manage-tiers/create/page.jsx
'use client';

import React, { useState, useEffect } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import Paper from '@mui/material/Paper';

import Grid from '@mui/material/Grid'; // For layout

import Box from '@mui/material/Box';

import { getLocalizedUrl } from '@/utils/i18n'; // Assuming this utility exists

const CreateTierPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang: locale } = useParams(); // Correctly get locale for App Router

  const [name, setName] = useState('');
  const [price, setPrice] = useState(''); // Price in cents
  const [features, setFeatures] = useState(''); // Comma-separated or one per line
  const [stripePriceId, setStripePriceId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Protection for Super Admin
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || (session && session.user.role !== 'SUPER_ADMIN')) {
      router.replace(getLocalizedUrl('/', locale)); // Redirect if not Super Admin
    }
  }, [session, status, router, locale]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!name.trim() || !price.trim() || !features.trim()) {
      setError('Name, Price, and Features are required.');
      setIsLoading(false);

      return;
    }

    const priceInCents = parseInt(price, 10);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      setError('Price must be a positive number (in cents).');
      setIsLoading(false);

      return;
    }

    // Convert features string (e.g., comma-separated or newline-separated) to array
    const featuresArray = features.split(/\n|,/).map(f => f.trim()).filter(f => f);

    try {
      const res = await fetch('/api/admin/pricing-tiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: priceInCents,
          features: featuresArray,
          stripePriceId: stripePriceId.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to the manage tiers page on success
        router.push(getLocalizedUrl('/admin/manage-tiers', locale));
      } else {
        setError(data.message || 'Failed to create pricing tier.');
      }
    } catch (err) {
      console.error('Create Tier error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return <Typography>Loading...</Typography>;
  
  if (status !== 'authenticated' || !session || session.user.role !== 'SUPER_ADMIN') {
    return <Typography>Access Denied. You must be a Super Admin to view this page.</Typography>;
  }


  return (
    <Paper sx={{ p: 4, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create New Pricing Tier
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tier Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price (in cents)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stripe Price ID (Optional)"
              value={stripePriceId}
              onChange={(e) => setStripePriceId(e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Features (one per line or comma-separated)"
              multiline
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
              placeholder="Feature 1&#10;Feature 2, Feature 3"
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push(getLocalizedUrl('/admin/manage-tiers', locale))}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Tier'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateTierPage;
