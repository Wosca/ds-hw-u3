"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CatchFiltersProps {
  currentBeach?: number;
  currentSpecies?: number;
  currentDateFrom?: string;
  currentDateTo?: string;
  SPECIES: { id: number; name: string }[];
  BEACHES: { id: number; name: string }[];
}

export function CatchFilters({
  currentBeach,
  currentSpecies,
  currentDateFrom,
  currentDateTo,
  SPECIES,
  BEACHES,
}: CatchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [beach, setBeach] = useState<string>(currentBeach?.toString() || "");
  const [species, setSpecies] = useState<string>(
    currentSpecies?.toString() || ""
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    currentDateFrom ? new Date(currentDateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    currentDateTo ? new Date(currentDateTo) : undefined
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Reset to page 1 when filters change
    params.set("page", "1");

    // Apply beach filter
    if (beach) {
      params.set("beach", beach);
    } else {
      params.delete("beach");
    }

    // Apply species filter
    if (species) {
      params.set("species", species);
    } else {
      params.delete("species");
    }

    // Apply date range filters
    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString().split("T")[0]);
    } else {
      params.delete("dateFrom");
    }

    if (dateTo) {
      params.set("dateTo", dateTo.toISOString().split("T")[0]);
    } else {
      params.delete("dateTo");
    }

    router.push(`?${params.toString()}`);
  };

  const resetFilters = () => {
    setBeach("");
    setSpecies("");
    setDateFrom(undefined);
    setDateTo(undefined);

    const params = new URLSearchParams(searchParams);
    params.delete("beach");
    params.delete("species");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = beach || species || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Beach</label>
          <Select value={beach} onValueChange={setBeach}>
            <SelectTrigger>
              <SelectValue placeholder="All beaches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All beaches</SelectItem>
              {BEACHES.map((beach) => (
                <SelectItem key={beach.id} value={beach.id.toString()}>
                  {beach.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Species</label>
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger>
              <SelectValue placeholder="All species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All species</SelectItem>
              {SPECIES.map((species) => (
                <SelectItem key={species.id} value={species.id.toString()}>
                  {species.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">From Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">To Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className={!hasActiveFilters ? "opacity-50" : ""}
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
