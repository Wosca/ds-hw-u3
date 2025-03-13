"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Fish } from "lucide-react";

type SpeciesStat = {
  species: string;
  risk: string;
  catchCount: number;
};

export function SpeciesDistribution({
  speciesStats,
}: {
  speciesStats: SpeciesStat[];
}) {
  // Colors for the pie chart based on risk level
  const COLORS = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#22c55e",
    Unknown: "#94a3b8",
  };

  // Find the maximum catch count for relative scaling
  const maxCatchCount = Math.max(
    ...speciesStats.map((stat) => stat.catchCount)
  );

  // Prepare data for pie chart
  const pieData = speciesStats
    .filter((stat) => stat.catchCount > 0) // Only include species with catches
    .map((stat) => ({
      name: stat.species,
      value: stat.catchCount,
      risk: stat.risk,
    }));

  // Group data by risk level for the risk distribution tab
  const riskGroups = speciesStats.reduce((groups, stat) => {
    if (!groups[stat.risk]) {
      groups[stat.risk] = { risk: stat.risk, count: 0 };
    }
    groups[stat.risk].count += stat.catchCount;
    return groups;
  }, {} as Record<string, { risk: string; count: number }>);

  const riskData = Object.values(riskGroups);
  const totalCatches = riskData.reduce((sum, group) => sum + group.count, 0);

  // Function to get risk badge color
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return <Badge variant="destructive">{risk}</Badge>;
      case "Medium":
        return (
          <Badge variant="default" className="bg-amber-500">
            {risk}
          </Badge>
        );
      case "Low":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            {risk}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{risk}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Species Distribution</CardTitle>
        <CardDescription>
          Analysis of shark species and their risk levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="species">
          <TabsList className="mb-4">
            <TabsTrigger value="species">By Species</TabsTrigger>
            <TabsTrigger value="risk">By Risk Level</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>

          <TabsContent value="species" className="space-y-4">
            {speciesStats.map((stat) => (
              <div
                key={stat.species}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Fish className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{stat.species}</span>
                  <span className="ml-2">{getRiskBadge(stat.risk)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress
                    value={(stat.catchCount / maxCatchCount) * 100}
                    className="w-24 h-2"
                  />
                  <span className="text-sm font-medium w-10 text-right">
                    {stat.catchCount}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {riskData.map((group) => (
              <div
                key={group.risk}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {getRiskBadge(group.risk)}
                  <span className="text-sm text-muted-foreground">
                    {((group.count / totalCatches) * 100).toFixed(1)}% of all
                    catches
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress
                    value={(group.count / totalCatches) * 100}
                    className="w-24 h-2"
                    // Apply color based on risk level
                    style={
                      {
                        "--progress-foreground":
                          COLORS[group.risk as keyof typeof COLORS],
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-sm font-medium w-10 text-right">
                    {group.count}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="chart">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.risk as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} catches`, "Count"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
