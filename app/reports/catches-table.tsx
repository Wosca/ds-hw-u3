"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Info } from "lucide-react";

type Catch = {
  catchID: number;
  date: string;
  fate: string;
  sharkName: string;
  species: string;
  risk: string;
  beach: string;
  area: string;
};

export function CatchesTable({ catches }: { catches: Catch[] }) {
  const [selectedCatch, setSelectedCatch] = useState<Catch | null>(null);

  // Function to format date (assuming date is in ISO format)
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

  // Function to get risk badge color
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return <Badge variant="destructive">{risk}</Badge>;
      case "Medium":
        return (
          <Badge variant="warning" className="bg-amber-500">
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

  if (catches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Info className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No catch reports found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shark Catch Reports</CardTitle>
        <CardDescription>
          A comprehensive list of shark catches recorded in our database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Shark</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Fate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catches.map((catchItem) => (
              <TableRow
                key={catchItem.catchID}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedCatch(catchItem)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(catchItem.date)}
                  </div>
                </TableCell>
                <TableCell>{catchItem.sharkName}</TableCell>
                <TableCell className="font-mono text-xs">
                  {catchItem.species}
                </TableCell>
                <TableCell>{getRiskBadge(catchItem.risk)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {catchItem.beach}
                  </div>
                </TableCell>
                <TableCell>{catchItem.fate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={!!selectedCatch}
          onOpenChange={(open) => !open && setSelectedCatch(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Catch Details</DialogTitle>
              <DialogDescription>
                Detailed information about this shark catch
              </DialogDescription>
            </DialogHeader>
            {selectedCatch && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">ID:</span>
                  <span className="col-span-3 font-mono text-sm">
                    {selectedCatch.catchID}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="col-span-3">
                    {formatDate(selectedCatch.date)}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Shark:</span>
                  <span className="col-span-3">{selectedCatch.sharkName}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Species:</span>
                  <span className="col-span-3 font-mono text-xs">
                    {selectedCatch.species}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Risk Level:</span>
                  <span className="col-span-3">
                    {getRiskBadge(selectedCatch.risk)}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Beach:</span>
                  <span className="col-span-3">{selectedCatch.beach}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Area:</span>
                  <span className="col-span-3">{selectedCatch.area}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Fate:</span>
                  <span className="col-span-3">{selectedCatch.fate}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
