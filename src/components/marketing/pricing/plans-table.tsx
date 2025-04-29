import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { Plan } from './plan';

export function PlansTable(): React.JSX.Element {
  const [isAnnual, setIsAnnual] = React.useState(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnnual(event.target.checked);
  };

  const monthlyPrices = {
    essentials: 29,
    pro: 89,
    elite: 149,
  };

  const annualPrices = {
    essentials: monthlyPrices.essentials * 12 * 0.85,
    pro: monthlyPrices.pro * 12 * 0.85,
    elite: monthlyPrices.elite * 12 * 0.85,
  };

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', py: { xs: '60px', sm: '120px' } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ textAlign: 'center' }} variant="h3">
              Start today. Boost up your services!
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body1">
              Join 10,000+ developers &amp; designers using Devias to power modern web projects.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="body2">Monthly</Typography>
              <Switch checked={isAnnual} onChange={handleSwitchChange} />
              <Typography variant="body2">Annually</Typography>
              {isAnnual && <Chip color="success" label="15% OFF" size="small" />}
            </Stack>
          </Stack>

          <div>
            <Grid container spacing={3}>
              <Grid size={{ md: 4, xs: 12 }}>
                <Plan
                  action={<Button variant="outlined">Select</Button>}
                  currency="USD"
                  description="For Small Business Owners & Beginners."
                  features={[
                    'Simple Analytics Dashboard (Traffic, Leads, Conversions)',
                    'On-Page SEO Audit & Basic Keyword Tracking',
                    'Website speed (one time, con refresh)',
                    'AI Chatbot (Limited Conversations) - per day limit responses',
                    'Lead Capture & Basic CRM (Up to 500 Contacts)',
                    'Google Search Console & GA4 Integration',
                    'No Plugins Needed – Easy Setup',
                    'Email Support',
                  ]}
                  id="Essentials-plan"
                  name="Essentials Plan"
                  price={isAnnual ? annualPrices.essentials : monthlyPrices.essentials}
                  period={isAnnual ? '/year' : '/month'}
                />
              </Grid>

              <Grid size={{ md: 4, xs: 12 }}>
                <Plan
                  action={<Button variant="contained">Select</Button>}
                  currency="USD"
                  description="For Growing Businesses & eCommerce Stores"
                  features={[
                    'Everything in Essentials +',
                    'Full SEO Toolkit (Keyword Tracking, Competitor Analysis, Backlink Monitoring)',
                    'CRM with Lead Nurturing (Up to 5,000 Contacts)',
                    'AI Chatbot (Limited Conversations)',
                    'Social Media & Google My Business Integration',
                    'Automated Lead Follow-Ups',
                    'Chat Support',
                  ]}
                  id="Pro-plan"
                  name="Pro Plan"
                  popular
                  price={isAnnual ? annualPrices.pro : monthlyPrices.pro}
                  period={isAnnual ? '/year' : '/month'}
                />
              </Grid>

              <Grid size={{ md: 4, xs: 12 }}>
                <Plan
                  action={
                    <Button color="secondary" variant="contained">
                      Select
                    </Button>
                  }
                  currency="USD"
                  description="For Agencies & Power Users."
                  features={[
                    'Everything in Pro +',
                    'Multi-Site Management for WordPress (Track Multiple Websites)',
                    'AI-Powered Predictive Analytics & Lead Scoring',
                    'CRM with Workflow Automation (Up to 10,000 Contacts)',
                    'AI Chatbot (Unlimited Conversations)',
                    'Dedicated Account Manager / Email / Chat Support',
                  ]}
                  id="elite-plan"
                  name="Elite Plan"
                  price={isAnnual ? annualPrices.elite : monthlyPrices.elite}
                  period={isAnnual ? '/year' : '/month'}
                />
              </Grid>
            </Grid>
          </div>

          <div>
            <Typography color="text.secondary" component="p" sx={{ textAlign: 'center' }} variant="caption">
              30% of our income goes into Whale Charity
            </Typography>
          </div>
        </Stack>
      </Container>
    </Box>
  );
}
