"use client";

import { useState } from 'react';

import Grid from '@mui/material/Grid2';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { RiAddLine, RiArrowDownSLine } from 'react-icons/ri';

const fetchCityState = async (zip) => {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);

    if (!response.ok) return null;

    const data = await response.json();
    const place = data.places[0];

    return {
      city: place["place name"],
      state: place["state abbreviation"],
    };
  } catch {
    return null;
  }
};

const TaxTab = () => {
  const [taxes, setTaxes] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addTax = () => {
    const newIndex = taxes.length;

    setTaxes(prev => [...prev, {
      zip: '',
      taxName: '',
      type: 'percentage',
      value: 0,
      city: '',
      state: ''
    }]);
    setExpandedIndex(newIndex);
  };

  const updateTax = async (index, field, value) => {
    const newTaxes = [...taxes];

    if (field === 'zip') {
      value = value.replace(/[^0-9]/g, '').slice(0, 5);
      newTaxes[index].zip = value;

      if (value.length === 5) {
        const location = await fetchCityState(value);

        if (location) {
          newTaxes[index].city = location.city;
          newTaxes[index].state = location.state;
          newTaxes[index].taxName = `${value} / ${location.city}, ${location.state}`;
        } else {
          newTaxes[index].city = '';
          newTaxes[index].state = '';
          newTaxes[index].taxName = '';
        }
      }
    } else {
      newTaxes[index][field] = value;
    }

    setTaxes(newTaxes);
  };

  const deleteTax = (index) => {
    const newTaxes = taxes.filter((_, i) => i !== index);

    setTaxes(newTaxes);

    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  return (
    <Grid container spacing={10} sx={{mt: 3}}>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Taxes</Typography>
          </div>
          <Card>
            <CardContent>
              {taxes.map((tax, index) => (
                <Accordion
                  key={index}
                  expanded={expandedIndex === index}
                  onChange={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<RiArrowDownSLine size={20}/>} sx={{background: expandedIndex === index ? 'var(--primary-color)' : 'var(--background-color)', borderRadius: 1, color: expandedIndex === index ? 'white' : 'var(--text-primary)'}}>
                    <Grid style={{ display: 'flex', alignItems: 'center'}}>
                      <Typography fontWeight="bold">
                        {(tax.taxName || 'New Tax')}
                      </Typography>
                      <Typography variant='caption' sx={{color: 'var(--secondary-color)', px: 2}}>
                        {tax.type}
                      </Typography>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={6} sx={{p: 2}}>
                      
                      {/* <Grid size={{ xs: 3 }}>
                        <Typography variant='body2'>Zip Code</Typography>
                      </Grid>
                      <Grid size={{ xs: 9 }}>
                        <TextField
                          label="Zip Code"
                          fullWidth
                          value={tax.zip}
                          onChange={(e) => updateTax(index, 'zip', e.target.value)}
                        />
                      </Grid> */}

                      {/* <Grid size={{ xs: 12 }}><Divider /></Grid> */}

                      <Grid size={{ xs: 3 }}>
                        <Typography variant='body2'>Tax Name</Typography>
                      </Grid>
                      <Grid size={{ xs: 3 }}>
                        <TextField
                          label="Zip Code"
                          fullWidth
                          value={tax.zip}
                          onChange={(e) => updateTax(index, 'zip', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Tax Name"
                          fullWidth
                          value={tax.taxName}
                          onChange={(e) => updateTax(index, 'taxName', e.target.value)}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}><Divider /></Grid>

                      <Grid size={{ xs: 3 }}>
                        <Typography variant='body2'>Tax Type</Typography>
                      </Grid>
                      <Grid size={{ xs: 9 }}>
                        <Grid container spacing={6}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>Tax Type</InputLabel>
                              <Select
                                value={tax.type}
                                label="Tax Type"
                                onChange={(e) => updateTax(index, 'type', e.target.value)}
                              >
                                <MenuItem value="percentage">Percentage of the booking price</MenuItem>
                                <MenuItem value="fixed">Fixed amount</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label={tax.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                              type="number"
                              fullWidth
                              value={tax.value}
                              onChange={(e) => updateTax(index, 'value', parseFloat(e.target.value) || 0)}
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12 }}><Divider /></Grid>

                      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="error" onClick={() => deleteTax(index)}>
                          Delete
                        </Button>
                        <Button variant="contained" color="primary">
                          Save Tax
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Button
                variant="outlined"
                startIcon={<RiAddLine />}
                onClick={addTax}
                sx={{ width: '100%', mt: 2 }}
              >
                Add Tax
              </Button>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  );
};

export default TaxTab;
