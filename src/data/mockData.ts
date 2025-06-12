
export interface Opportunity {
  id: number;
  name: string;
  salesperson_id: number;
  lead_source: string;
  opportunity_status: 'active' | 'won' | 'lost';
  proposal_status: 'created' | 'pitched';
  revenue: number;
  cash_collected: number;
  calls: Call[];
}

export interface Call {
  id: number;
  deal_id: number;
  type: 'Discovery' | 'Closing';
  number: number;
  date: string;
  duration: number;
  recording_url?: string;
}

export interface Salesperson {
  id: number;
  name: string;
}

export const salespeople: Salesperson[] = [
  { id: 1, name: 'Ana García' },
  { id: 2, name: 'Carlos López' },
  { id: 3, name: 'María Rodríguez' },
  { id: 4, name: 'Pedro Martínez' },
];

export const opportunities: Opportunity[] = [
  {
    id: 1,
    name: 'ABC Corporation Deal',
    salesperson_id: 1,
    lead_source: 'Website',
    opportunity_status: 'active',
    proposal_status: 'pitched',
    revenue: 50000,
    cash_collected: 25000,
    calls: [
      {
        id: 1,
        deal_id: 1,
        type: 'Discovery',
        number: 1,
        date: '2024-06-10T10:00:00',
        duration: 45,
      },
      {
        id: 2,
        deal_id: 1,
        type: 'Closing',
        number: 2,
        date: '2024-06-15T14:00:00',
        duration: 30,
      },
    ],
  },
  {
    id: 2,
    name: 'XYZ Tech Solutions',
    salesperson_id: 2,
    lead_source: 'Referral',
    opportunity_status: 'won',
    proposal_status: 'pitched',
    revenue: 75000,
    cash_collected: 75000,
    calls: [
      {
        id: 3,
        deal_id: 2,
        type: 'Discovery',
        number: 1,
        date: '2024-06-05T09:00:00',
        duration: 60,
      },
    ],
  },
  {
    id: 3,
    name: 'StartupCo Partnership',
    salesperson_id: 3,
    lead_source: 'Cold Outreach',
    opportunity_status: 'active',
    proposal_status: 'created',
    revenue: 30000,
    cash_collected: 0,
    calls: [
      {
        id: 4,
        deal_id: 3,
        type: 'Discovery',
        number: 1,
        date: '2024-06-12T16:00:00',
        duration: 35,
      },
    ],
  },
  {
    id: 4,
    name: 'Enterprise Corp',
    salesperson_id: 1,
    lead_source: 'Website',
    opportunity_status: 'lost',
    proposal_status: 'pitched',
    revenue: 100000,
    cash_collected: 0,
    calls: [
      {
        id: 5,
        deal_id: 4,
        type: 'Discovery',
        number: 1,
        date: '2024-06-01T11:00:00',
        duration: 50,
      },
      {
        id: 6,
        deal_id: 4,
        type: 'Closing',
        number: 2,
        date: '2024-06-08T15:00:00',
        duration: 40,
      },
    ],
  },
];

export const upcomingCalls: Call[] = [
  {
    id: 7,
    deal_id: 1,
    type: 'Closing',
    number: 3,
    date: '2024-06-20T10:00:00',
    duration: 45,
  },
  {
    id: 8,
    deal_id: 3,
    type: 'Closing',
    number: 2,
    date: '2024-06-18T14:00:00',
    duration: 30,
  },
];
