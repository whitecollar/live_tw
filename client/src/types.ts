export interface IMember {
  id: string
  name: string
  city: string
}

export interface IRoundResultsItem {
  place?: number
  firstRound?: number
  secondRound?: number
  result?: number
  id: string
  name: string
  city: string
}

export interface IRoundTableMember {
  id: number
  color: 'red' | 'blue' | 'green' | 'yellow'
  name: string
  city: string
  place?: number
}

interface IRound {
  roundName: string
  roundSize: number
  results: IRoundResultsItem[]
  tableResults: IRoundTableMember[][]
}

export interface ICompetitionFormValues {
  title: string
  subtitle: string
  sport: string
  place: string
  qualificationRounds?: number
  rounds: IRound[]
}

export interface IInputCompetition extends ICompetitionFormValues {
  members: IMember[]
  isTwoRoundsInQualification: boolean
}

export interface ICompetition extends IInputCompetition {
  _id: string
}

interface ITeam {
  id: number
  title: string
  region: string
  id0: number
  name0: string
  id1: number
  name1: string
}

export interface ITeamRoundTableItem {
  id: number
  color: 'red' | 'blue' | 'green' | 'yellow'
  title: string
  region: string
  place?: number
  id0: number
  name0: string
  id1: number
  name1: string
}

interface ITeamRound {
  roundName: string
  roundSize: number
  tableResults: ITeamRoundTableItem[][]
}

export interface ITeamQualificationItem {
  id: number
  title: string
  region: string
  id0: number
  name0: string
  id1: number
  name1: string
  place?: number
  firstRound?: number
  secondRound?: number
  result?: number
}

export interface ITeamCompetitionFormValues {
  title: string
  subtitle: string
  sport: string
  place: string
  rounds: ITeamRound[]
  isQualification: boolean
}

export interface IInputTeamCompetition extends ITeamCompetitionFormValues {
  teams: ITeam[]
}

export interface ITeamCompetition extends IInputTeamCompetition {
  qualificationResults?: ITeamQualificationItem[]
  _id: string
}
