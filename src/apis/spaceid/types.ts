export interface SpaceId {
  spaceId: number;
  spaceName: string;
}

export interface SpaceIdListResponse {
  code: string;
  message: string;
  result: {
    spaceList: SpaceId[];
  };
}
