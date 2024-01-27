import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { CompetitionModule } from './competition/competition.module'
import { TeamCompetitionModule } from './team-competition/team-competition.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    CompetitionModule,
    TeamCompetitionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
