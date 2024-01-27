import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  ITeamRound,
  ITeamRoundTableItem,
  TeamCompetition,
  TTeamCompetitionDocument,
} from './team-competition.schema'
import { Model } from 'mongoose'
import { CreateTeamCompetitionDto } from './dtos/create-team-competition.dto'
import { AddTeamTableRecordDto } from './dtos/add-team-table-record.dto'
import { AddTeamTableResultDto } from './dtos/add-team-table-result.dto'
import { AddTeamListResultDto } from './dtos/add-team-list-result.dto'

@Injectable()
export class TeamCompetitionService {
  constructor(
    @InjectModel(TeamCompetition.name)
    private teamCompetitionModel: Model<TTeamCompetitionDocument>,
  ) {}

  async createCompetition(dto: CreateTeamCompetitionDto) {
    await this.teamCompetitionModel.create({
      ...dto,
      rounds: dto.rounds.map((round) => ({
        ...round,
        tableResults: Array(round.roundSize).fill(Array(4).fill([])),
      })),
      qualificationResults: dto.teams.map((team, place) => ({
        ...team,
        place: place + 1,
      })),
    })

    return this.teamCompetitionModel.find()
  }

  async deleteCompetition(id: string) {
    await this.teamCompetitionModel.findByIdAndDelete(id)

    return await this.teamCompetitionModel.find()
  }

  async getCompetitions() {
    return await this.teamCompetitionModel.find()
  }

  async addListResult(dto: AddTeamListResultDto) {
    const competition = await this.teamCompetitionModel.findById(
      dto.competitionId,
    )
    const { number: inputNumber, round: roundIndex, ms, sec, min } = dto
    const number = `${inputNumber}`
    const timeMs = min * 60000 + sec * 1000 + ms

    competition.qualificationResults = competition.qualificationResults.map(
      (result) => {
        if (`${result.id}` === number) {
          if (typeof dto.status === 'string') {
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
              result.result = +result.firstRound + +result.secondRound
            }
          }
          if (roundIndex === '2') {
            result.secondRound = timeMs
            result.result = +result.firstRound + result.secondRound
          }
        }

        return result
      },
    )

    competition.qualificationResults.sort((a, b) => {
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

      if (a.firstRound && b.firstRound && !a.secondRound && !b.secondRound) {
        if (a.firstRound < b.firstRound) {
          return -1
        } else {
          return 1
        }
      }

      if (!a.secondRound && b.secondRound) {
        return 1
      }

      if (a.secondRound && !b.secondRound) {
        return -1
      }

      if (a.result < b.result) {
        return -1
      } else {
        return 1
      }
    })

    competition.qualificationResults = competition.qualificationResults.map(
      (result, index) => ({
        ...result,
        place: index + 1,
      }),
    )

    await competition.save()

    return await this.teamCompetitionModel.find()
  }

  async addTableRecord(dto: AddTeamTableRecordDto) {
    const competition = await this.teamCompetitionModel.findById(
      dto.competitionId,
    )

    const rounds: ITeamRound[] = competition.rounds.map((inputRound) => {
      const round = JSON.parse(JSON.stringify(inputRound)) as ITeamRound

      if (round.roundName === dto.roundName) {
        const {
          itemIndex,
          newRecord: { teamId0, teamId1, teamId2, teamId3 },
        } = dto

        const team0 =
          teamId0 && competition.teams.find(({ id }) => id === teamId0)

        const team1 =
          teamId1 && competition.teams.find(({ id }) => id === teamId1)

        const team2 =
          teamId2 && competition.teams.find(({ id }) => id === teamId2)

        const team3 =
          teamId3 && competition.teams.find(({ id }) => id === teamId3)

        round.tableResults = round.tableResults.map((resultsColumn, index) => {
          if (index === itemIndex) {
            const result: ITeamRoundTableItem[] = []

            if (team0) {
              result.push({
                id: teamId0,
                color: 'red',
                title: team0.title,
                region: team0.region,
                id0: team0.id0,
                name0: team0.name0,
                id1: team0.id1,
                name1: team0.name1,
              })
            }

            if (team1) {
              result.push({
                id: teamId1,
                color: 'green',
                title: team1.title,
                region: team1.region,
                id0: team1.id0,
                name0: team1.name0,
                id1: team1.id1,
                name1: team1.name1,
              })
            }

            if (team2) {
              result.push({
                id: teamId2,
                color: 'blue',
                title: team2.title,
                region: team2.region,
                id0: team2.id0,
                name0: team2.name0,
                id1: team2.id1,
                name1: team2.name1,
              })
            }

            if (team3) {
              result.push({
                id: teamId3,
                color: 'yellow',
                title: team3.title,
                region: team3.region,
                id0: team3.id0,
                name0: team3.name0,
                id1: team3.id1,
                name1: team3.name1,
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

    return await this.teamCompetitionModel.find()
  }

  async addTableResult(dto: AddTeamTableResultDto) {
    const competition = await this.teamCompetitionModel.findById(
      dto.competitionId,
    )

    const rounds: ITeamRound[] = competition.rounds.map((inputRound) => {
      const round = JSON.parse(JSON.stringify(inputRound)) as ITeamRound

      if (round.roundName === dto.roundName) {
        const {
          itemIndex,
          newResult: {
            teamId0,
            teamId1,
            teamId2,
            teamId3,
            teamPlace0,
            teamPlace1,
            teamPlace2,
            teamPlace3,
          },
        } = dto

        round.tableResults = round.tableResults.map(
          (inputResultsColumn, index) => {
            const resultsColumn = JSON.parse(JSON.stringify(inputResultsColumn))

            if (index === itemIndex) {
              return resultsColumn
                .map((result) => {
                  if (result.id === teamId0) {
                    return { ...result, place: teamPlace0 }
                  }
                  if (result.id === teamId1) {
                    return { ...result, place: teamPlace1 }
                  }
                  if (result.id === teamId2) {
                    return { ...result, place: teamPlace2 }
                  }
                  if (result.id === teamId3) {
                    return { ...result, place: teamPlace3 }
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

    return await this.teamCompetitionModel.find()
  }
}
