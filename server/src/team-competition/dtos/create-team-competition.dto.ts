import { ITeam, ITeamRound } from '../team-competition.schema'

export class CreateTeamCompetitionDto {
  readonly title: string
  readonly subtitle: string
  readonly sport: string
  readonly place: string
  readonly teams: ITeam[]
  readonly rounds: ITeamRound[]
  readonly isQualification: boolean
}
