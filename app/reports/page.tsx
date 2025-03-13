import { Suspense } from "react";
import { db } from "@/lib/db";
import { desc, eq, sql, count, gte, lte, and } from "drizzle-orm";
import { catchDetails, sharkDetails, beachDetails } from "@/lib/schema";
import { CatchesTable } from "./catches-table";
import { StatsCards } from "./stats-card";
import { BeachStats } from "./beach-stats";
import { SpeciesDistribution } from "./species-distribution";
import { CatchFilters } from "./catches-filters";
// Update the import for the pagination component
import { PaginationControl } from "./pagination-control";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Skeleton loaders
const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-8 w-[120px]" />
    </div>
    <div className="rounded-md border">
      <Skeleton className="h-[400px] w-full" />
    </div>
    <div className="flex items-center justify-center">
      <Skeleton className="h-10 w-[350px]" />
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array(4)
      .fill(0)
      .map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full" />
      ))}
  </div>
);

// Server component to fetch and display catch data
export default async function ReportsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    beach?: string;
    species?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  // Parse filter parameters
  const beachFilter = searchParams.beach
    ? Number.parseInt(searchParams.beach)
    : undefined;
  const speciesFilter = searchParams.species;
  const dateFromFilter = searchParams.dateFrom;
  const dateToFilter = searchParams.dateTo;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Shark Catch Reports
        </h1>
        <p className="text-muted-foreground">
          Public database of shark catches with detailed statistics and
          information.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
          <CardDescription>
            Narrow down the catch reports by beach, species, or date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CatchFilters
            currentBeach={beachFilter}
            currentSpecies={speciesFilter}
            currentDateFrom={dateFromFilter}
            currentDateTo={dateToFilter}
          />
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton />}>
        <CatchesSection
          currentPage={currentPage}
          pageSize={pageSize}
          offset={offset}
          beachId={beachFilter}
          species={speciesFilter}
          dateFrom={dateFromFilter}
          dateTo={dateToFilter}
        />
      </Suspense>

      <div className="space-y-8 mt-12">
        <h2 className="text-2xl font-bold tracking-tight">
          Detailed Statistics
        </h2>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <BeachStatsSection />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <SpeciesSection />
        </Suspense>
      </div>
    </div>
  );
}

// Server component for overall statistics
async function StatsSection() {
  // Fetch statistics data
  const totalCatches = await db.select({ count: count() }).from(catchDetails);

  const totalBeaches = await db.select({ count: count() }).from(beachDetails);

  const totalSpecies = await db.select({ count: count() }).from(sharkDetails);

  const latestCatch = await db
    .select({ date: catchDetails.date })
    .from(catchDetails)
    .orderBy(desc(catchDetails.date))
    .limit(1);

  const highRiskCount = await db
    .select({ count: count() })
    .from(sharkDetails)
    .where(eq(sharkDetails.risk, "High"));

  return (
    <StatsCards
      totalCatches={totalCatches[0].count}
      totalBeaches={totalBeaches[0].count}
      totalSpecies={totalSpecies[0].count}
      latestCatch={latestCatch[0]?.date || "No data"}
      highRiskCount={highRiskCount[0].count}
    />
  );
}

// Server component for catches table with pagination
async function CatchesSection({
  currentPage,
  pageSize,
  offset,
  beachId,
  species,
  dateFrom,
  dateTo,
}: {
  currentPage: number;
  pageSize: number;
  offset: number;
  beachId?: number;
  species?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  // Build conditions array for filters
  const conditions = [];

  if (beachId) {
    conditions.push(eq(beachDetails.beachID, beachId));
  }

  if (species) {
    conditions.push(eq(sharkDetails.species, species));
  }

  if (dateFrom) {
    conditions.push(gte(catchDetails.date, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(catchDetails.date, dateTo));
  }

  // Build query with filters
  let query = db
    .select({
      catchID: catchDetails.catchID,
      date: catchDetails.date,
      fate: catchDetails.fate,
      sharkName: sharkDetails.name,
      species: sharkDetails.species,
      risk: sharkDetails.risk,
      beach: beachDetails.beach,
      area: beachDetails.area,
    })
    .from(catchDetails)
    .innerJoin(sharkDetails, eq(catchDetails.sharkID, sharkDetails.sharkID))
    .innerJoin(beachDetails, eq(catchDetails.beachID, beachDetails.beachID));

  // Apply all filters at once if there are any
  if (conditions.length > 0) {
    query = query.where(
      conditions.length === 1 ? conditions[0] : and(...conditions)
    );
  }

  // Execute query with pagination
  const catches = await query
    .orderBy(desc(catchDetails.date))
    .limit(pageSize)
    .offset(offset);

  // Count total for pagination
  let countQuery = db
    .select({ count: count() })
    .from(catchDetails)
    .innerJoin(sharkDetails, eq(catchDetails.sharkID, sharkDetails.sharkID))
    .innerJoin(beachDetails, eq(catchDetails.beachID, beachDetails.beachID));

  // Apply the same conditions to count query
  if (conditions.length > 0) {
    countQuery = countQuery.where(
      conditions.length === 1 ? conditions[0] : and(...conditions)
    );
  }

  const totalCount = await countQuery;
  const totalPages = Math.ceil(totalCount[0].count / pageSize);

  return (
    <div className="space-y-4">
      <CatchesTable catches={catches} />
      <PaginationControl currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

// Server component for beach statistics
async function BeachStatsSection() {
  // Get catches by beach with counts
  const beachStats = await db
    .select({
      beachID: beachDetails.beachID,
      beach: beachDetails.beach,
      area: beachDetails.area,
      catchCount: count(catchDetails.catchID),
    })
    .from(beachDetails)
    .leftJoin(catchDetails, eq(beachDetails.beachID, catchDetails.beachID))
    .groupBy(beachDetails.beachID, beachDetails.beach, beachDetails.area)
    .orderBy(desc(sql`count(${catchDetails.catchID})`));

  return <BeachStats beachStats={beachStats} />;
}

// Server component for species distribution
async function SpeciesSection() {
  // Get catches by species with counts
  const speciesStats = await db
    .select({
      species: sharkDetails.species,
      risk: sharkDetails.risk,
      catchCount: count(catchDetails.catchID),
    })
    .from(sharkDetails)
    .leftJoin(catchDetails, eq(sharkDetails.sharkID, catchDetails.sharkID))
    .groupBy(sharkDetails.species, sharkDetails.risk)
    .orderBy(desc(sql`count(${catchDetails.catchID})`));

  return <SpeciesDistribution speciesStats={speciesStats} />;
}
