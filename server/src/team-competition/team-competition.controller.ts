import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { AddTeamListResultDto } from './dtos/add-team-list-result.dto'
import { AddTeamTableRecordDto } from './dtos/add-team-table-record.dto'
import { AddTeamTableResultDto } from './dtos/add-team-table-result.dto'
import { CreateTeamCompetitionDto } from './dtos/create-team-competition.dto'
import { TeamCompetitionService } from './team-competition.service'

@Controller('/team-competitions')
export class TeamCompetitionController {
  constructor(private teamCompetitionService: TeamCompetitionService) {}

  @Post()
  createCompetition(@Body() dto: CreateTeamCompetitionDto) {
    return this.teamCompetitionService.createCompetition(dto)
  }

  @Delete()
  deleteCompetition(@Query('id') id: string) {
    return this.teamCompetitionService.deleteCompetition(id)
  }

  @Get()
  getCompetitions() {
    return this.teamCompetitionService.getCompetitions()
  }

  @Post('/add-list-result')
  addListResult(@Body() dto: AddTeamListResultDto) {
    return this.teamCompetitionService.addListResult(dto)
  }

  @Post('/add-table-record')
  addTableRecord(@Body() dto: AddTeamTableRecordDto) {
    return this.teamCompetitionService.addTableRecord(dto)
  }

  @Post('/add-table-result')
  addTableResult(@Body() dto: AddTeamTableResultDto) {
    return this.teamCompetitionService.addTableResult(dto)
  }
}
