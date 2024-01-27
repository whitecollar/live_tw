import { IMember, IRound } from '../competition.schema'

export class CreateCompetitionDto {
  readonly title: string
  readonly subtitle: string
  readonly sport: string
  readonly place: string
  readonly members: IMember[]
  readonly rounds: IRound[]
  readonly isTwoRoundsInQualification: boolean
}
