import { BaziChart } from '../../types';
import { buildXiangfaReading } from './index';
import { getAtmosphere } from './atmosphere';
import { buildRelationships, buildLifeSeasons } from './relationships';
import { buildInteractions } from './interactions';
import { buildStoryline } from './narrative';

// The whole solo reading, assembled from the content builders in one pure
// function. The build order is a small DAG — atmo / interactions / lifeSeasons
// each need the base reading, and storyline needs those — so keeping it here
// (not spread across a component's useMemos) means the order lives in one place
// and the entire reading is testable without React. `currentYear` is passed in
// (not read from the clock) so the result is deterministic.
export interface AssembledReading {
  reading: ReturnType<typeof buildXiangfaReading>;
  atmo: ReturnType<typeof getAtmosphere>;
  relationships: ReturnType<typeof buildRelationships>;
  interactions: ReturnType<typeof buildInteractions>;
  lifeSeasons: ReturnType<typeof buildLifeSeasons>;
  storyline: ReturnType<typeof buildStoryline>;
}

export function buildReading(chart: BaziChart, currentYear: number): AssembledReading {
  const reading = buildXiangfaReading(chart);
  const atmo = getAtmosphere(reading.stem.element, reading.season.season);
  const relationships = buildRelationships(chart);
  const interactions = buildInteractions(chart, reading);
  const lifeSeasons = buildLifeSeasons(chart, reading, currentYear);
  const storyline = buildStoryline(chart, reading, relationships, lifeSeasons, interactions);
  return { reading, atmo, relationships, interactions, lifeSeasons, storyline };
}
