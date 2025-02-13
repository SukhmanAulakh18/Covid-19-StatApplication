export interface ProvinceData {
  pruid: number;
  prname: string;
  date: string;
  totalcases: string;
  numtotal_last7: string;
  numdeaths: number;
  numdeaths_last7: number;
}

export interface FatalityData {
  _id: number;
  date: string;
  deaths_total: number;
  death_covid: number;
  death_covid_contrib: number;
  death_unknown_missing: number;
}

export interface OntarioData {
  FILE_DATE: string;
  PHU_NAME: string;
  PHU_NUM: string;
  ACTIVE_CASES: string;
  RESOLVED_CASES: string;
  DEATHS: string;
  ARCHIVED_RESOLVED_CASES: string;
  ARCHIVED_DEATHS: string;
}

export interface OntarioStatusData {
  date: string;
  active_cases: number;
  resolved_cases: number;
  deaths: number;
  total_cases: number;
  hospitalized: number;
  icu: number;
  ventilator: number;
}

export interface CanadaSummary {
  date: string;
  total_cases: number;
  new_cases: number;
  total_deaths: number;
  new_deaths: number;
  active_cases: number;
  recovered: number;
}

export interface DetailedRecord {
  id: string;
  date: string;
  province: string;
  total_cases: number;
  new_cases: number;
  deaths: number;
  recovered: number;
}
