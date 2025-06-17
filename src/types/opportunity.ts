
import { Call } from '@/hooks/useCalls';

export interface Opportunity {
  id: number;
  name: string;
  salesperson_id: number | null;
  revenue: number;
  cash_collected: number;
  user_id: string;
  proposal_status: string;
  lead_source: string;
  opportunity_status: string;
  created_at: string;
  pipeline_id?: string | null;
  stage_id?: string | null;
  last_interaction_at?: string | null;
  calls?: Call[];
}
