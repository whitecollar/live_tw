export class AddTeamTableRecordDto {
  readonly newRecord: {
    teamId0?: number
    teamId1?: number
    teamId2?: number
    teamId3?: number
  }
  readonly competitionId: string
  readonly roundName: string
  readonly itemIndex: number
}
