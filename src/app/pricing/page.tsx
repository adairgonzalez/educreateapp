import { Metadata } from 'next';
import { PricingPage } from '@/components/home/pricing/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing - eduCreate',
  description: 'Choose the perfect plan for your educational needs',
};

export default function Page() {
  return <PricingPage />;
}
