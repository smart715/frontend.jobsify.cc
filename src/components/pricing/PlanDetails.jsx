// src/components/pricing/PlanDetails.jsx
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import classnames from 'classnames';

const PlanDetails = ({ data, pricingPlan }) => {
  const theme = useTheme();

  return (
    <CardContent
      className={classnames('relative border rounded flex flex-col gap-5 pbs-[3.75rem]', {
        'border-primary': data?.popularPlan // popularPlan for border color
      })}
    >
      {data?.popularPlan ? (
        <Chip
          color='primary'
          label='Popular'
          size='small'
          className='absolute block-start-4 inline-end-5'
          variant='tonal'
        />
      ) : null}
      {data?.imgSrc && ( // Check if imgSrc exists
        <div className='flex justify-center'>
          <img
            src={data.imgSrc}
            height={data.imgHeight || 50} // Default height if not provided
            width={data.imgWidth || 50}   // Default width if not provided
            alt={`${data.title?.toLowerCase().replace(/\s+/g, '-') || 'plan'}-img`}
          />
        </div>
      )}
      <div className='text-center flex flex-col gap-2'>
        <Typography variant='h4'>{data?.title || 'Unnamed Plan'}</Typography>
        {data?.subtitle && <Typography>{data.subtitle}</Typography>}
      </div>
      <div className='relative mbe-[1.125rem]'>
        <div className='flex justify-center'>
          <Typography component='sup' className='self-start font-medium'>
            $
          </Typography>
          <Typography variant='h1' component='span' color='primary.main'>
            {pricingPlan === 'annually' && data?.yearlyPlan?.monthly !== undefined
              ? data.yearlyPlan.monthly
              : (data?.monthlyPrice !== undefined ? data.monthlyPrice : 'N/A')}
          </Typography>
          <Typography component='sub' className='self-end font-medium'>
            /month
          </Typography>
        </div>
        {pricingPlan === 'annually' && data?.yearlyPlan?.annually !== undefined ? (
          <Typography
            variant='caption'
            className={classnames(
              'absolute inline-end-1/2',
              theme.direction === 'rtl' ? 'translate-x-[-50%]' : 'translate-x-[50%]'
            )}
          >{`USD ${data.yearlyPlan.annually}/year`}</Typography>
        ) : null}
      </div>
      <div className='flex flex-col gap-4'>
        {data?.planBenefits && Array.isArray(data.planBenefits) ? data.planBenefits.map((item, index) => (
          <div key={index} className='flex items-center gap-2.5'>
            <span className='inline-flex'>
              <i className='ri-checkbox-blank-circle-line text-sm' /> {/* Or appropriate icon */}
            </span>
            <Typography>{item}</Typography>
          </div>
        )) : <Typography variant="body2" color="text.secondary">No benefits listed.</Typography>}
      </div>
      <Button
        fullWidth
        color={data?.currentPlan ? 'success' : 'primary'}
        variant={data?.popularPlan ? 'contained' : 'outlined'}
      >
        {data?.currentPlan ? 'Your Current Plan' : 'Choose Plan'}
        {/* Simplified button text, original theme might have more complex logic like "Upgrade" */}
      </Button>
    </CardContent>
  );
};

export default PlanDetails;
