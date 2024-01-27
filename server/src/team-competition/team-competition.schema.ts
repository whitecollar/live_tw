import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TTeamCompetitionDocument = TeamCompetition & Document

export interface ITeam {
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

export interface ITeamRound {
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
  firstRound?: number | string
  secondRound?: number | string
  result?: number
}

@Schema()
export class TeamCompetition {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  subtitle: string

  @Prop({ required: true })
  sport: string

  @Prop({ required: true })
  place: string

  @Prop({ required: true })
  teams: ITeam[]

  @Prop({ required: true })
  rounds: ITeamRound[]

  @Prop()
  isQualification: boolean

  @Prop()
  qualificationResults: ITeamQualificationItem[]
}

export const TeamCompetitionSchema =
  SchemaFactory.createForClass(TeamCompetition)
