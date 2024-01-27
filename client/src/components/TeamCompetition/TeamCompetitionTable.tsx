import { Switch } from 'antd'
import axios from 'axios'
import { FC, useState } from 'react'
import { useMutation } from 'react-query'
import { SERVER_ADDRESS } from '../../config'
import appState from '../../store/appState'
import { ITeamCompetition } from '../../types'
import {
  INewTeamTableRecord,
  INewTeamTableResult,
  TeamCompetitionTableItem,
} from './TeamCompetitionTableItem'

interface IProps {
  competition: ITeamCompetition
}

export interface IAddTeamTableRecordMutationArgs {
  newRecord: INewTeamTableRecord
  competitionId: string
  roundName: string
  itemIndex: number
}

export interface IAddTeamTableResultMutationArgs {
  newResult: INewTeamTableResult
  competitionId: string
  roundName: string
  itemIndex: number
}

export const TeamCompetitionTable: FC<IProps> = ({ competition }) => {
  const [isSmallVersion, setIsSmallVersion] = useState(false)

  const addTableRecordMutation = useMutation(
    'team-competitions',
    async ({
      competitionId,
      itemIndex,
      newRecord,
      roundName,
    }: IAddTeamTableRecordMutationArgs) =>
      (
        await axios.post<ITeamCompetition[]>(
          `${SERVER_ADDRESS}/team-competitions/add-table-record`,
          { newRecord, competitionId, itemIndex, roundName },
        )
      ).data,
  )

  const addTableResultMutation = useMutation(
    'team-competitions',
    async ({
      competitionId,
      itemIndex,
      newResult,
      roundName,
    }: IAddTeamTableResultMutationArgs) =>
      (
        await axios.post<ITeamCompetition[]>(
          `${SERVER_ADDRESS}/team-competitions/add-table-result`,
          { newResult, competitionId, itemIndex, roundName },
        )
      ).data,
  )

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'space-between',
        }}
      >
        {competition.rounds.map((round) => (
          <div key={round.roundName}>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {round.roundName}
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '100%',
                gap: 8,
              }}
            >
              {round.tableResults.map((_, index) => (
                <TeamCompetitionTableItem
                  key={index}
                  competitionId={competition._id}
                  roundName={round.roundName}
                  itemIndex={index}
                  addTableResultMutation={addTableResultMutation}
                  addTableRecordMutation={addTableRecordMutation}
                  isSmallVersion={isSmallVersion}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 70 }}>
        <p style={{ marginRight: 10 }}>Упрощенная версия:</p>
        <Switch
          onChange={(checked) => {
            setIsSmallVersion(checked)
            appState.setIsDarkBg(checked)
          }}
        />
      </div>
    </div>
  )
}
