import axios from 'axios'
import { FC, useState } from 'react'
import { useMutation } from 'react-query'
import { SERVER_ADDRESS } from '../config'
import { ICompetition } from '../types'
import {
  CompetitionTableItem,
  INewTableRecord,
  INewTableResult,
} from './CompetitionTableItem'
import { Switch } from 'antd'
import appState from '../store/appState'

interface IProps {
  competition: ICompetition
}

export interface IAddTableRecordMutationArgs {
  newRecord: INewTableRecord
  competitionId: string
  roundName: string
  itemIndex: number
}

export interface IAddTableResultMutationArgs {
  newResult: INewTableResult
  competitionId: string
  roundName: string
  itemIndex: number
}

export const CompetitionTable: FC<IProps> = ({ competition }) => {
  const [isSmallVersion, setIsSmallVersion] = useState(false)

  const addTableRecordMutation = useMutation(
    async ({
      competitionId,
      itemIndex,
      newRecord,
      roundName,
    }: IAddTableRecordMutationArgs) =>
      (
        await axios.post<ICompetition[]>(
          `${SERVER_ADDRESS}/competitions/add-table-record`,
          { newRecord, competitionId, itemIndex, roundName },
        )
      ).data,
  )

  const addTableResultMutation = useMutation(
    async ({
      competitionId,
      itemIndex,
      newResult,
      roundName,
    }: IAddTableResultMutationArgs) =>
      (
        await axios.post<ICompetition[]>(
          `${SERVER_ADDRESS}/competitions/add-table-result`,
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
              {round.tableResults.map((tableResult, index) => (
                <CompetitionTableItem
                  key={index}
                  members={tableResult}
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
