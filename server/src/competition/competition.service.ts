import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Competition,
  IRound,
  IRoundTableMember,
  TCompetitionDocument,
} from './competition.schema'
import { CreateCompetitionDto } from './dtos/create-competition.dto'
import { Model } from 'mongoose'
import { AddListResultDto } from './dtos/add-list-result.dto'
import { AddTableRecordDto } from './dtos/add-table-record.dto'
import { AddTableResultDto } from './dtos/add-table-result.dto'

@Injectable()
export class CompetitionService {
  constructor(
    @InjectModel(Competition.name)
    private competitionModel: Model<TCompetitionDocument>,
  ) {}

  async createCompetition(dto: CreateCompetitionDto) {
    await this.competitionModel.create({
      ...dto,
      rounds: dto.rounds.map((round, index) => ({
        ...round,
        results: !index
          ? dto.members.map((member, place) => ({
              ...member,
              place: place + 1,
            }))
          : [],
        tableResults: Array(round.roundSize).fill(Array(4).fill([])),
      })),
    })

    return this.competitionModel.find()
  }

  async deleteCompetition(id: string) {
    await this.competitionModel.findByIdAndDelete(id)

    return await this.competitionModel.find()
  }

  async getCompetitions() {
    return await this.competitionModel.find()
  }

  async addListResult(dto: AddListResultDto) {
    const competition = await this.competitionModel.findById(dto.competitionId)
    const isTwoRounds = competition.isTwoRoundsInQualification

    const rounds: IRound[] = competition.rounds.map((inputRound) => {
      const round = JSON.parse(JSON.stringify(inputRound)) as IRound

      if (round.roundName === dto.roundName) {
        const { number: inputNumber, round: roundIndex, ms, sec, min } = dto
        const number = `${inputNumber}`
        const timeMs = min * 60000 + sec * 1000 + ms

        round.results = round.results.map((result) => {
          if (`${result.id}` === number) {
            if (dto.status) {
              if (roundIndex === '1') {
                result.firstRound = dto.status
                result.result = undefined
              }
              if (roundIndex === '2') {
                result.secondRound = dto.status
                result.result = undefined
              }

              return result
            }
            if (roundIndex === '1') {
              result.firstRound = timeMs
              if (result.secondRound) {
                result.result = Math.min(result.firstRound, +result.secondRound)
              }
            }
            if (roundIndex === '2' && isTwoRounds) {
              result.secondRound = timeMs
              result.result = Math.min(+result.firstRound, result.secondRound)
            }
          }

          return result
        })

        round.results.sort((a, b) => {
          if (
            typeof a.firstRound === 'string' ||
            typeof a.secondRound === 'string'
          ) {
            return 1
          }

          if (
            typeof b.firstRound === 'string' ||
            typeof b.secondRound === 'string'
          ) {
            return -1
          }

          if (!a.firstRound && b.firstRound) {
            return 1
          }

          if (a.firstRound && !b.firstRound) {
            return -1
          }

          if ((a.result ?? a.firstRound) < (b.result ?? b.firstRound)) {
            return -1
          } else {
            return 1
          }
        })

        round.results = round.results.map((result, index) => ({
          ...result,
          place: index + 1,
        }))
      }

      return round
    })

    competition.rounds = rounds

    await competition.save()

    return await this.competitionModel.find()
  }

  async addTableRecord(dto: AddTableRecordDto) {
    const competition = await this.competitionModel.findById(dto.competitionId)

    const rounds: IRound[] = competition.rounds.map((inputRound) => {
      const round = JSON.parse(JSON.stringify(inputRound)) as IRound

      if (round.roundName === dto.roundName) {
        const {
          itemIndex,
          newRecord: { memberId0, memberId1, memberId2, memberId3 },
        } = dto

        const member0 =
          memberId0 && competition.members.find(({ id }) => id === memberId0)

        const member1 =
          memberId1 && competition.members.find(({ id }) => id === memberId1)

        const member2 =
          memberId2 && competition.members.find(({ id }) => id === memberId2)

        const member3 =
          memberId3 && competition.members.find(({ id }) => id === memberId3)

        round.tableResults = round.tableResults.map((resultsColumn, index) => {
          if (index === itemIndex) {
            const result: IRoundTableMember[] = []

            if (member0) {
              result.push({
                id: memberId0,
                color: 'red',
                name: member0.name,
                city: member0.city,
              })
            }

            if (member1) {
              result.push({
                id: memberId1,
                color: 'green',
                name: member1.name,
                city: member1.city,
              })
            }

            if (member2) {
              result.push({
                id: memberId2,
                color: 'blue',
                name: member2.name,
                city: member2.city,
              })
            }

            if (member3) {
              result.push({
                id: memberId3,
                color: 'yellow',
                name: member3.name,
                city: member3.city,
              })
            }

            return result
          }

          return resultsColumn
        })
      }

      return round
    })

    competition.rounds = rounds

    await competition.save()

    return await this.competitionModel.find()
  }

  async addTableResult(dto: AddTableResultDto) {
    const competition = await this.competitionModel.findById(dto.competitionId)

    const rounds: IRound[] = competition.rounds.map((inputRound) => {
      const round = JSON.parse(JSON.stringify(inputRound)) as IRound

      if (round.roundName === dto.roundName) {
        const {
          itemIndex,
          newResult: {
            memberId0,
            memberId1,
            memberId2,
            memberId3,
            memberPlace0,
            memberPlace1,
            memberPlace2,
            memberPlace3,
          },
        } = dto

        round.tableResults = round.tableResults.map(
          (inputResultsColumn, index) => {
            const resultsColumn = JSON.parse(JSON.stringify(inputResultsColumn))

            if (index === itemIndex) {
              return resultsColumn
                .map((result) => {
                  if (result.id === memberId0) {
                    return { ...result, place: memberPlace0 }
                  }
                  if (result.id === memberId1) {
                    return { ...result, place: memberPlace1 }
                  }
                  if (result.id === memberId2) {
                    return { ...result, place: memberPlace2 }
                  }
                  if (result.id === memberId3) {
                    return { ...result, place: memberPlace3 }
                  }
                })
                .sort((a, b) => a.place - b.place)
            }

            return resultsColumn
          },
        )
      }

      return round
    })

    competition.rounds = rounds

    await competition.save()

    return await this.competitionModel.find()
  }
}
