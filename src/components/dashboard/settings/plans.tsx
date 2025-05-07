import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';

import { PlanCard } from './plan-card';
import type { Plan, PlanId } from './plan-card';

const plans = [
  { 
    id: 'essential', 
    name: 'Essential', 
    currency: 'USD', 
    price: 29.00,
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    currency: 'USD', 
    price: 89.00,
  },
  { 
    id: 'elite', 
    name: 'Elite', 
    currency: 'USD', 
    price: 149.00,
  },
] satisfies Plan[];

export function Plans(): React.JSX.Element {
  const [currentPlanId, setCurrentPlanId] = React.useState<PlanId>('pro');
  const [isAnnual, setIsAnnual] = React.useState(false);

  const handlePlanChange = (planId: PlanId) => {
    setCurrentPlanId(planId);
  };

  const handleBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnnual(event.target.checked);
  };

  const calculatePrice = (price: number): number => {
    return isAnnual ? price * 12 * 0.85 : price;
  };

  console.log('Current plan ID:', currentPlanId);
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <CreditCardIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        subheader="You can upgrade and downgrade whenever you want."
        title="Change plan"
      />
      <CardContent>
        <Stack divider={<Divider />} spacing={3}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2">Monthly</Typography>
              <Switch checked={isAnnual} onChange={handleBillingChange} />
              <Typography variant="body2">Annually</Typography>
              {isAnnual && <Chip color="success" label="15% OFF" size="small" />}
            </Stack>

            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid key={plan.id} size={{ md: 4, xs: 12 }}>
                  <PlanCard 
                    isCurrent={plan.id === currentPlanId}
                    plan={{
                      ...plan,
                      price: calculatePrice(plan.price),
                      period: isAnnual ? '/year' : '/month'
                    }}
                    action={
                      <Button 
                        variant={plan.id === currentPlanId ? 'contained' : 'outlined'}
                        onClick={() => handlePlanChange(plan.id)}
                        fullWidth
                      >
                        {plan.id === currentPlanId ? 'Current Plan' : 'Select'}
                      </Button>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
          
          <Stack spacing={3}>
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Billing details</Typography>
              <Button color="secondary" startIcon={<PencilSimpleIcon />}>
                Edit
              </Button>
            </Stack>
            <Card sx={{ borderRadius: 1 }} variant="outlined">
              <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '12px 24px' }}>
                {(
                  [
                    { key: 'Current Plan', value: plans.find(p => p.id === currentPlanId)?.name },
                    { key: 'Billing Cycle', value: isAnnual ? 'Annual (15% discount)' : 'Monthly' },
                    { key: 'Next Billing Date', value: 'June 15, 2024' },
                    { key: 'Payment Method', value: '**** 1111' },
                  ] satisfies { key: string; value: React.ReactNode }[]
                ).map(
                  (item): React.JSX.Element => (
                    <PropertyItem key={item.key} name={item.key} value={item.value} />
                  )
                )}
              </PropertyList>
            </Card>
            <Typography color="text.secondary" variant="body2">
              We cannot refund once you purchased a subscription, but you can always{' '}
              <Link variant="inherit">cancel</Link>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}