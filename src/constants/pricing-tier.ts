export interface Tier {
  name: string;
  id: 'starter' | 'pro' | 'advanced';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: 'Starter',
    id: 'starter',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: '“Learning the Ropes”',
    features: [
      '5 lesson plans per month',
      'Basic AI assistance',
      'Standard templates',
      'Essential analytics',
      'Email support',
      'Single user account',
      'Perfect for new educators',
    ],
    featured: false,
    priceId: { month: 'pri_01jgwx06pk2sp2msxekjy7nen6', year: 'pri_01jgwx2vqj2cmjjveb9pr5v2tg' },
  },
  {
    name: 'Pro',
    id: 'pro',
    icon: '/assets/icons/price-tiers/basic-icon.svg',
    description: '“Elevate Your Teaching”',
    features: [
      'Unlimited lesson plans',
      'Smart AI customization',
      'Premium templates',
      'Comprehensive analytics',
      'Priority support',
      '3 user accounts',
      'Curriculum tracking',
      'Monthly insights report',
    ],
    featured: true,
    priceId: { month: 'pri_01jgwx7dakhxwc8v2db3ybyhkt', year: 'pri_01jgwx8dg2an9a3xk49zdrk7b7' },
  },
  {
    name: 'Enterprise',
    id: 'advanced',
    icon: '/assets/icons/price-tiers/pro-icon.svg',
    description: '“Comprehensive Educational Solution” ',
    features: [
      'Enterprise-level planning',
      'Advanced AI modeling',
      'Full curriculum design tools',
      'Team collaboration features',
      'Dedicated account manager',
      'Unlimited user accounts',
      'Advanced reporting',
      'Custom integrations',
      '24/7 professional support',
    ],
    featured: false,
    priceId: { month: 'pri_01jgwxbbrwg4vpcdqdwj0brbeq', year: 'pri_01jgwxcedp232b41s2drf7gybx' },
  },
];
