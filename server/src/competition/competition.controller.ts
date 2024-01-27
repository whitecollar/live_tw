import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { CompetitionService } from './competition.service'
import { AddListResultDto } from './dtos/add-list-result.dto'
import { AddTableRecordDto } from './dtos/add-table-record.dto'
import { AddTableResultDto } from './dtos/add-table-result.dto'
import { CreateCompetitionDto } from './dtos/create-competition.dto'

@Controller('/competitions')
export class CompetitionController {
  constructor(private competitionService: CompetitionService) {}

  @Post()
  createCompetition(@Body() dto: CreateCompetitionDto) {
    return this.competitionService.createCompetition(dto)
  }

  @Delete()
  deleteCompetition(@Query('id') id: string) {
    return this.competitionService.deleteCompetition(id)
  }

  @Get()
  getCompetitions() {
    return this.competitionService.getCompetitions()
  }

  @Post('/add-list-result')
  addListResult(@Body() dto: AddListResultDto) {
    return this.competitionService.addListResult(dto)
  }

  @Post('/add-table-record')
  addTableRecord(@Body() dto: AddTableRecordDto) {
    return this.competitionService.addTableRecord(dto)
  }

  @Post('/add-table-result')
  addTableResult(@Body() dto: AddTableResultDto) {
    return this.competitionService.addTableResult(dto)
  }
}
