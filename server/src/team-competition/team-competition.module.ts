import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TeamCompetitionController } from './team-competition.controller'
import {
  TeamCompetition,
  TeamCompetitionSchema,
} from './team-competition.schema'
import { TeamCompetitionService } from './team-competition.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamCompetition.name, schema: TeamCompetitionSchema },
    ]),
  ],
  controllers: [TeamCompetitionController],
  providers: [TeamCompetitionService],
})
export class TeamCompetitionModule {}
