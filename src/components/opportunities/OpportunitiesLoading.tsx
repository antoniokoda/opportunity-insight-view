
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const OpportunitiesLoading = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
            <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-zinc-200 rounded"></div>
              <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
