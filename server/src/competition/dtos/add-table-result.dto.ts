export class AddTableResultDto {
  readonly newResult: {
    memberId0?: number
    memberId1?: number
    memberId2?: number
    memberId3?: number
    memberPlace0?: number
    memberPlace1?: number
    memberPlace2?: number
    memberPlace3?: number
  }
  readonly competitionId: string
  readonly itemIndex: number
  readonly roundName: string
}
