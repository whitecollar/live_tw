import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TCompetitionDocument = Competition & Document

export interface IRoundTableMember {
  id: number
  color: 'red' | 'blue' | 'green' | 'yellow'
  name: string
  city: string
  place?: number
}

interface IRoundResultsItem {
  place?: number
  firstRound?: number | string
  secondRound?: number | string
  result?: number
  id: string
  name: string
  city: string
}

export interface IRound {
  roundName: string
  roundSize: number
  results: IRoundResultsItem[]
  tableResults: IRoundTableMember[][]
}

export interface IMember {
  id: number
  name: string
  city: string
}

@Schema()
export class Competition {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  subtitle: string

  @Prop({ required: true })
  sport: string

  @Prop({ required: true })
  place: string

  @Prop({ required: true })
  members: IMember[]

  @Prop({ required: true })
  rounds: IRound[]

  @Prop({ required: true })
  isTwoRoundsInQualification: boolean
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition)
