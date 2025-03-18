"use server";

import { parse } from "csv-parse/sync";
import { db } from "@/lib/db"; // Assuming this is your db connection
import { sharkDetails, beachDetails, catchDetails } from "@/lib/schema";
import z from "zod";
import { sql } from "drizzle-orm";

const sharkRisks = {
  "Carcharhinus amblyrhynchos": { commonName: "Grey Reef", risk: "Low" },
  "Carcharhinus brachyurus": { commonName: "Bronze Whaler", risk: "Medium" },
  "Carcharhinus brevipinna": { commonName: "Spinner", risk: "Medium" },
  "Carcharhinus falciformis": { commonName: "Silky", risk: "Low" },
  "Carcharhinus galapagensis": { commonName: "Galapagos", risk: "Low" },
  "Carcharhinus leucas": { commonName: "Bull", risk: "High" },
  "Carcharhinus limbatus": { commonName: "Blacktip", risk: "Medium" },
  "Carcharhinus longimanus": {
    commonName: "Oceanic Whitetip",
    risk: "Medium",
  },
  "Carcharhinus melanopterus": {
    commonName: "Blacktip Reef",
    risk: "Medium",
  },
  "Carcharhinus obscurus": { commonName: "Dusky", risk: "Low" },
  "Carcharhinus perezi": { commonName: "Caribbean Reef", risk: "Low" },
  "Carcharhinus plumbeus": { commonName: "Sandbar", risk: "Low" },
  "Carcharhinus spp.": { commonName: "Requiem", risk: "High" },
  "Carcharias taurus": { commonName: "Sand Tiger", risk: "Medium" },
  "Carcharodon carcharias": { commonName: "White", risk: "High" },
  "Galeocerdo cuvier": { commonName: "Tiger", risk: "High" },
  "Galeorhinus galeus": { commonName: "Tope", risk: "Low" },
  "Ginglymostoma cirratum": { commonName: "Nurse", risk: "Low" },
  "Heterodontus portusjacksoni": {
    commonName: "Port Jackson",
    risk: "Low",
  },
  "Isistius brasiliensis": { commonName: "Cookiecutter", risk: "Low" },
  "Isurus oxyrinchus": { commonName: "Shortfin Mako", risk: "Medium" },
  "Isurus spp.": { commonName: "Mako", risk: "Low" },
  "Lamna nasus": { commonName: "Porbeagle", risk: "Low" },
  "Negaprion brevirostris": { commonName: "Lemon", risk: "Medium" },
  "Notorynchus cepedianus": { commonName: "Sevengill", risk: "Low" },
  "Orectolobus maculatus": {
    commonName: "Spotted Wobbegong",
    risk: "Low",
  },
  "Orectolobus ornatus": { commonName: "Ornate Wobbegong", risk: "Low" },
  "Orectolobus spp.": { commonName: "Wobbegong", risk: "Medium" },
  "Prionace glauca": { commonName: "Blue", risk: "Medium" },
  "Rhinobatos spp.": { commonName: "Guitarfish", risk: "Low" },
  "Sphyrna spp.": { commonName: "Hammerhead", risk: "Medium" },
  "Squatina dumeril": { commonName: "Atlantic Angel Shark", risk: "Low" },
  "Triaenodon obesus": { commonName: "Whitetip reef", risk: "Low" },
  "Triakis semifasciata": { commonName: "Leopard", risk: "Low" },
};

export const processSharkData = async (file: string) => {
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    autoParse: true,
  });

  interface SharkRecord {
    _id: string | number;
    "Species name": string;
    "Common Name": string;
    gearBeach: string;
    areaName: string;
    date: string;
    Fate: string;
  }
  
  const formattedRecords = records.map((record: SharkRecord) => {
    const speciesName = record["Species name"];
    const riskInfo = sharkRisks[speciesName as keyof typeof sharkRisks] || {
      risk: "Unknown",
    };

    return {
      id: Number(record["_id"]),
      name: record["Common Name"],
      species: speciesName,
      risk: riskInfo.risk,
      beach: record["gearBeach"],
      area: record["areaName"],
      date: record["date"],
      fate: record["Fate"],
    };
  });

  const sharkSchema = z.object({
      id: z.number(),
      name: z.string(),
      species: z.string(),
      risk: z.enum(["Unknown", "Low", "Medium", "High"]),
      beach: z.string(),
      area: z.string(),
      date: z.string(),
      fate: z.string(),
    });
    

  try {
    
    formattedRecords.forEach((record: Record<string, unknown>) => {
      sharkSchema.parse(record);
    });
  } catch (err) {
    console.error(err);
    return { error: true, errorFrom: "zod" };
  }

  const sharkRecords = formattedRecords.map((record: { [x: string]: SharkRecord }) => {
    return {
      sharkID: record.id,
      name: record.name,
      species: record.species,
      risk: record.risk,
    };
  });

  let addedSharks = 0;

  try {
    const response = await db
      .insert(sharkDetails)
      .values(sharkRecords)
      .onConflictDoNothing({ target: sharkDetails.name })
      .returning({ insertedId: sharkDetails.sharkID });
    addedSharks = response.length;
    // return { error: false, addedSharks: response.length };
  } catch (err) {
    console.error(err);
    return { error: true, errorFrom: "db" };
  }

  const beachRecords = formattedRecords.map((record: { beach: string; area: string }) => {
    return {
      beach: record.beach,
      area: record.area,
    };
  });

  let addedBeaches = 0;

  try {
    const response = await db
      .insert(beachDetails)
      .values(beachRecords)
      .onConflictDoNothing({ target: [beachDetails.beach, beachDetails.area] })
      .returning({ insertedId: beachDetails.beachID });
    addedBeaches = response.length;
  } catch (err) {
    console.error(err);
    return { error: true, errorFrom: "db" };
  }

  // Query the database to get sharkIDs and beachIDs
  const sharksMap = new Map();
  const beachesMap = new Map();

    function removeDuplicates<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  const sharkNames = removeDuplicates(
    formattedRecords.map((r: { name: string }) => r.name)
  );
  const sharkSpecies = removeDuplicates(
    formattedRecords.map((r: { species: string }) => r.species)
  );

  // Get all sharks from DB with their IDs
  const dbSharks = await db
    .select()
    .from(sharkDetails)
    .where(
      sql`${sharkDetails.name} = ANY(ARRAY[${sql.join(
        sharkNames.map((name) => sql`${name}`),
        sql`, `
      )}])
          AND ${sharkDetails.species} = ANY(ARRAY[${sql.join(
        sharkSpecies.map((species) => sql`${species}`),
        sql`, `
      )}])`
    );

  dbSharks.forEach((shark) => {
    // Use both name and species as key to ensure uniqueness
    sharksMap.set(`${shark.name}_${shark.species}`, shark.sharkID);
  });

  // Get all beaches from DB with their IDs
  const dbBeaches = await db.select().from(beachDetails);
  dbBeaches.forEach((beach) => {
    beachesMap.set(`${beach.beach}_${beach.area}`, beach.beachID);
  });

  const catchRecords = formattedRecords.map((record: { [x: string]: SharkRecord }) => {
    // Use the maps to get the correct database IDs
    const sharkKey = `${record.name}_${record.species}`;
    const beachKey = `${record.beach}_${record.area}`;

    return {
      sharkID: sharksMap.get(sharkKey),
      beachID: beachesMap.get(beachKey),
      date: record.date,
      fate: record.fate,
    };
  });

  let addedCatches = 0;

  try {
    const response = await db
      .insert(catchDetails)
      .values(catchRecords)
      .returning({ insertedId: catchDetails.catchID });
    addedCatches = response.length;
  } catch (err) {
    console.error(err);
    return { error: true, errorFrom: "db" };
  }

  return {
    error: false,
    addedSharks,
    addedBeaches,
    addedCatches,
  };
  //   await revalidatePath("/dashboard");
};
