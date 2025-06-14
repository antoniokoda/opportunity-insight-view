
import { useMemo } from 'react';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardKpis = (filteredOpportunities: Opportunity[], calls: Call[]) => {
  return useMemo(() => {
    // Facturación REAL: solo oportunidades ganadas (won)
    const wonOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const totalRevenue = wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);

    // Facturación potencial: monto potencial de TODAS las oportunidades filtradas
    const potentialRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);

    const totalCash = filteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const totalCalls = calls.length;
    // Oportunidades activas: solo cantidad, sigue igual
    const activeOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'active').length;

    const lostOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const closedOpportunities = wonOpportunities.length + lostOpportunities.length;

    const averageDealSize = wonOpportunities.length > 0 
      ? wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / wonOpportunities.length
      : 0;
    
    const closingRate = closedOpportunities > 0 
      ? (wonOpportunities.length / closedOpportunities) * 100
      : 0;
    
    const proposalsPitched = filteredOpportunities.filter(opp => opp.proposal_status === 'pitched').length;

    // Usar solo llamadas PASADAS
    const now = new Date();
    const pastCalls = calls.filter(call => new Date(call.date) <= now);

    // Tasa real de asistencia: (asistidas entre todas las pasadas)
    const attendedPastCalls = pastCalls.filter(call => call.attended === true).length;
    const overallShowUpRate = pastCalls.length > 0
      ? (attendedPastCalls / pastCalls.length) * 100
      : 0;

    // First discovery show-up rate: solo para Discovery 1 PASADAS
    const firstDiscoveryPastCalls = pastCalls.filter(call =>
      call.type === 'Discovery 1'
    );
    const attendedFirstDiscoveryPast = firstDiscoveryPastCalls.filter(call => call.attended === true).length;
    const firstDiscoveryShowUpRate = firstDiscoveryPastCalls.length > 0
      ? (attendedFirstDiscoveryPast / firstDiscoveryPastCalls.length) * 100
      : 0;

    return {
      totalRevenue,
      potentialRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
      averageDealSize,
      closingRate,
      proposalsPitched,
      overallShowUpRate,
      firstDiscoveryShowUpRate,
    };
  }, [filteredOpportunities, calls]);
};

