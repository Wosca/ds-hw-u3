"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

type BeachStat = {
  beachID: number;
  beach: string;
  area: string;
  catchCount: number;
};

export function BeachStats({ beachStats }: { beachStats: BeachStat[] }) {
  // Find the maximum catch count for relative scaling
  const maxCatchCount = Math.max(...beachStats.map((stat) => stat.catchCount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beach Statistics</CardTitle>
        <CardDescription>
          Shark catch distribution by beach location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {beachStats.map((stat) => (
            <AccordionItem key={stat.beachID} value={stat.beachID.toString()}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{stat.beach}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({stat.area})
                    </span>
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
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Beach ID:</span>
                      <span className="ml-2 font-mono">{stat.beachID}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <span className="ml-2">{stat.area}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Total Catches:
                      </span>
                      <span className="ml-2 font-medium">
                        {stat.catchCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Percentage of total catches:
                      </span>
                      <span className="ml-2">
                        {(
                          (stat.catchCount /
                            beachStats.reduce(
                              (sum, s) => sum + s.catchCount,
                              0
                            )) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
