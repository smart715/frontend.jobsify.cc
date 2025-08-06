// src/app/[lang]/front-pages/pricing/page.jsx
// Component Imports
import PricingWrapper from '@/views/front-pages/pricing'; // Assuming this is the correct path to the wrapper

// Data Imports
// This server action was reverted to use fake-db
import { getPricingData } from '@/app/server/actions';

const PricingPage = async () => {
  // Vars
  const data = await getPricingData(); // Fetches static fake data now

  return <PricingWrapper data={data} />;
};

export default PricingPage;
