export interface RelationshipConfig {
  id: string;
  startDate: string;
}

export interface RelationshipConfigResponse {
  config: RelationshipConfig | null;
}
