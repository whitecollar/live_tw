import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CompetitionController } from './competition.controller'
import { Competition, CompetitionSchema } from './competition.schema'
import { CompetitionService } from './competition.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionSchema },
    ]),
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
