export interface ReportFilterState {
  startDate: string;
  endDate: string;
  category: string;
}

export interface EpidemiologicalReport {
  id: string;
  code: string;
  disease: string;
  casesCount: number;
  region: string;
  updatedAt: string;
}