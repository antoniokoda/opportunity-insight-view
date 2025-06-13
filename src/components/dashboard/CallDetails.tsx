
import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone, Clock, UserCheck } from 'lucide-react';

interface CallDetailsProps {
  callCounts: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
  averageDurations: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
  showUpRates: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
}

export const CallDetails: React.FC<CallDetailsProps> = ({
  callCounts,
  averageDurations,
  showUpRates
}) => {
  return (
    <div className="space-y-6">
      {/* Call Details & Duration */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-900">
          <Phone className="w-5 h-5" />
          Call Details & Duration
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Counts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-900">
              <Phone className="w-4 h-4" />
              Call Counts
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">First Discovery Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.discovery1}</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Second Discovery Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.discovery2}</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Third Discovery Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.discovery3}</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">First Closing Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.closing1}</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Second Closing Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.closing2}</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Third Closing Call Calls</p>
                <p className="text-2xl font-bold text-zinc-900">{callCounts.closing3}</p>
              </div>
            </div>
          </Card>

          {/* Average Call Durations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-900">
              <Clock className="w-4 h-4" />
              Average Call Durations
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. First Discovery Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.discovery1} min</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. Second Discovery Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.discovery2} min</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. Third Discovery Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.discovery3} min</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. First Closing Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.closing1} min</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. Second Closing Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.closing2} min</p>
              </div>
              <div className="text-center p-4 border border-zinc-300 rounded-lg">
                <p className="text-sm text-zinc-700 mb-2 font-medium">Avg. Third Closing Call Duration</p>
                <p className="text-2xl font-bold text-zinc-900">{averageDurations.closing3} min</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Show-Up Rates */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-900">
          <UserCheck className="w-5 h-5" />
          Detailed Show-Up Rates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">First Discovery Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.discovery1.toFixed(0)}%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">Second Discovery Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.discovery2.toFixed(0)}%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">Third Discovery Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.discovery3.toFixed(0)}%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">First Closing Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.closing1.toFixed(0)}%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">Second Closing Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.closing2.toFixed(0)}%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-700 font-medium">Third Closing Call Show-Up Rate</p>
              <UserCheck className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-2xl font-bold mt-2 text-zinc-900">{showUpRates.closing3.toFixed(0)}%</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
