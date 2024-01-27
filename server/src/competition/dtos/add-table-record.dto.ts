export class AddTableRecordDto {
  readonly newRecord: {
    memberId0?: number
    memberId1?: number
    memberId2?: number
    memberId3?: number
  }
  readonly competitionId: string
  readonly roundName: string
  readonly itemIndex: number
}
