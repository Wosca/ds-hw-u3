"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, MapPin, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalCatches: number;
  totalBeaches: number;
  totalSpecies: number;
  latestCatch: string;
  highRiskCount: number;
}

export function StatsCards({
  totalCatches,
  totalBeaches,
  totalSpecies,
  latestCatch,
  highRiskCount,
}: StatsCardsProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Catches</CardTitle>
          <Fish className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCatches.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Shark catches recorded in database
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monitored Beaches
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalBeaches.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Beaches under observation
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shark Species</CardTitle>
          <Fish className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalSpecies.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Unique species identified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDate(latestCatch)}</div>
          <p className="text-xs text-muted-foreground">
            Date of most recent catch
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
