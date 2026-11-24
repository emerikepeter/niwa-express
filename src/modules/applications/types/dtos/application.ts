/** Keep status values aligned with the API contract and badge styles. */
export type ApplicationStatus = "Approved" | "Rejected" | "Pending";

/** One row shown in the application records table. Dates use YYYY-MM-DD. */
export interface ApplicationRecord {
  reference: string;
  applicantName: string;
  applicationType: string;
  submissionDate: string;
  status: ApplicationStatus;
}

/** Expected REST payload: records plus the summary counters displayed above them. */
export interface ApplicationsApiResponse {
  data: ApplicationRecord[];
  summary: { approved: number; rejected: number };
}
