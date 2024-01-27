import { EditFilled, EyeOutlined } from '@ant-design/icons'
import { Button, Form, message } from 'antd'
import { FC, Fragment, useEffect, useState } from 'react'
import { UseMutationResult } from 'react-query'
import { Link } from 'react-router-dom'
import appState from '../../store/appState'
import { ITeamCompetition, ITeamRoundTableItem } from '../../types'
import { checkIsAuth } from '../../views/Login'
import { TableAddRecordModal } from '../TableModals/TableAddRecordModal'
import { TableAddResultModal } from '../TableModals/TableAddResultModal'
import {
  IAddTeamTableRecordMutationArgs,
  IAddTeamTableResultMutationArgs,
} from './TeamCompetitionTable'
import { INewTableRecord, INewTableResult } from '../CompetitionTableItem'

interface IProps {
  competitionId: string
  roundName: string
  itemIndex: number
  addTableResultMutation: UseMutationResult<
    ITeamCompetition[],
    unknown,
    IAddTeamTableResultMutationArgs,
    unknown
  >
  addTableRecordMutation: UseMutationResult<
    ITeamCompetition[],
    unknown,
    IAddTeamTableRecordMutationArgs,
    unknown
  >
  isSmallVersion: boolean
}

export interface INewTeamTableRecord {
  teamId0?: number
  teamId1?: number
  teamId2?: number
  teamId3?: number
}

export interface INewTeamTableResult {
  teamId0?: number
  teamId1?: number
  teamId2?: number
  teamId3?: number
  teamPlace0?: number
  teamPlace1?: number
  teamPlace2?: number
  teamPlace3?: number
}

export const TeamCompetitionTableItem: FC<IProps> = ({
  competitionId,
  roundName,
  itemIndex,
  addTableResultMutation,
  addTableRecordMutation,
  isSmallVersion,
}) => {
  const [isNumbersModalVisible, setIsNumbersModalVisible] = useState(false)
  const [isResultsModalVisible, setIsResultsModalVisible] = useState(false)
  const [numbersForm] = Form.useForm()
  const [resultsForm] = Form.useForm()
  const [teams, setTeams] = useState<ITeamRoundTableItem[]>([])

  const onNumbersModalFinish = (values: INewTeamTableRecord) => {
    numbersForm.resetFields()
    setIsNumbersModalVisible(false)
    addTableRecordMutation.mutate({
      newRecord: values,
      competitionId,
      roundName,
      itemIndex,
    })
  }

  const onResultsModalFinish = (values: INewTeamTableResult) => {
    resultsForm.resetFields()
    setIsResultsModalVisible(false)
    addTableResultMutation.mutate({
      newResult: {
        ...values,
        teamId0: teams[0] && teams[0].id,
        teamId1: teams[1] && teams[1].id,
        teamId2: teams[2] && teams[2].id,
        teamId3: teams[3] && teams[3].id,
      },
      competitionId,
      roundName,
      itemIndex,
    })
  }

  useEffect(() => {
    appState.teamCompetitions.forEach((competition) => {
      if (competition._id === competitionId) {
        competition.rounds.forEach((round) => {
          if (round.roundName === roundName) {
            setTeams(round.tableResults[itemIndex])
          }
        })
      }
    })
    // eslint-disable-next-line
  }, [appState.teamCompetitions, competitionId, itemIndex, roundName])

  useEffect(() => {
    if (addTableResultMutation.data) {
      appState.setTeamCompetitions(addTableResultMutation.data)
    }
  }, [addTableResultMutation.data])

  if (addTableResultMutation.error) {
    message.error('Произошла ошибка при отправке данных')
  }

  useEffect(() => {
    if (addTableRecordMutation.data) {
      appState.setTeamCompetitions(addTableRecordMutation.data)
    }
  }, [addTableRecordMutation.data])

  if (addTableResultMutation.error) {
    message.error('Произошла ошибка при отправке данных')
  }

  return (
    <div>
      <div style={{ padding: 7, borderRadius: 2, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!isSmallVersion && (
            <div style={{ display: 'flex', gap: 10 }}>
              <p style={{ fontWeight: 700 }}>{itemIndex + 1}</p>
              <Link
                to={`/team-competitions/${competitionId}/table-item`}
                onClick={() => {
                  appState.setTableItem({ roundName, index: itemIndex })
                }}
              >
                <Button size="small">
                  <EyeOutlined />
                </Button>
              </Link>
            </div>
          )}
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            {!isSmallVersion && (
              <tr style={{ fontWeight: 600 }}>
                <td style={{ paddingRight: 10, textAlign: 'center' }}>№</td>
                <td style={{ paddingRight: 10, whiteSpace: 'nowrap' }}></td>
                <td style={{ paddingRight: 10 }}>Рег.</td>
                <td>Цвет</td>
                <td style={{ paddingLeft: 10 }}>Место</td>
              </tr>
            )}
            {teams.map((team, index) => (
              <>
                <tr
                  key={index * 3 - 2}
                  style={{
                    borderBottom: team.id ? '' : '.5px solid #aaa',
                    height: 24.4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  <td style={{ paddingRight: 10, textAlign: 'center' }}>
                    {team.id}
                  </td>
                  <td
                    style={{
                      minWidth: 100,
                      whiteSpace: 'nowrap',
                      paddingRight: 10,
                    }}
                  >
                    {team.title}
                  </td>
                  <td style={{ paddingRight: 10, whiteSpace: 'nowrap' }}>
                    {team.region}
                  </td>
                  <td
                    style={{
                      minWidth: 34,
                      background:
                        team.color === 'red'
                          ? '#f5222d'
                          : team.color === 'green'
                          ? '#52c41a'
                          : team.color === 'blue'
                          ? '#096dd9'
                          : team.color === 'yellow'
                          ? '#fadb14'
                          : '',
                    }}
                  />
                  <td style={{ paddingLeft: 10 }}></td>
                </tr>
                <tr
                  key={index * 3 - 1}
                  style={{
                    borderBottom: team.id ? '' : '.5px solid #aaa',
                    height: 24.4,
                  }}
                >
                  <td style={{ paddingRight: 10, textAlign: 'center' }}>
                    {team.id0}
                  </td>
                  <td>{team.name0}</td>
                  <td></td>
                  <td
                    style={{
                      minWidth: 34,
                      background:
                        team.color === 'red'
                          ? '#f5222d'
                          : team.color === 'green'
                          ? '#52c41a'
                          : team.color === 'blue'
                          ? '#096dd9'
                          : team.color === 'yellow'
                          ? '#fadb14'
                          : '',
                    }}
                  />
                  <td
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      paddingLeft: 10,
                    }}
                  >
                    {team.place ?? ''}
                  </td>
                </tr>
                <tr
                  key={index * 3}
                  style={{
                    borderBottom: team.id ? '' : '.5px solid #aaa',
                    height: 24.4,
                  }}
                >
                  <td style={{ paddingRight: 10, textAlign: 'center' }}>
                    {team.id1}
                  </td>
                  <td>{team.name1}</td>
                  <td></td>
                  <td
                    style={{
                      minWidth: 34,
                      background:
                        team.color === 'red'
                          ? '#f5222d'
                          : team.color === 'green'
                          ? '#52c41a'
                          : team.color === 'blue'
                          ? '#096dd9'
                          : team.color === 'yellow'
                          ? '#fadb14'
                          : '',
                    }}
                  />
                  <td />
                </tr>
              </>
            ))}
            {checkIsAuth() && !isSmallVersion && (
              <>
                <tr>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      style={{ width: '90%' }}
                      onClick={() => setIsNumbersModalVisible(true)}
                      size="small"
                    >
                      <EditFilled />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      style={{ width: '80%' }}
                      onClick={() => setIsResultsModalVisible(true)}
                      size="small"
                      disabled={
                        !!teams.length &&
                        !teams[0].id &&
                        !teams[1].id &&
                        !teams[2].id &&
                        !teams[3].id
                      }
                    >
                      <EditFilled />
                    </Button>
                  </td>
                </tr>
                <TableAddRecordModal
                  isNumbersModalVisible={isNumbersModalVisible}
                  setIsNumbersModalVisible={setIsNumbersModalVisible}
                  onNumbersModalFinish={
                    onNumbersModalFinish as (values: INewTableRecord) => void
                  }
                  numbersForm={numbersForm}
                  isTeamModal
                />
                <TableAddResultModal
                  onResultsModalFinish={
                    onResultsModalFinish as (values: INewTableResult) => void
                  }
                  setIsResultsModalVisible={setIsResultsModalVisible}
                  isResultsModalVisible={isResultsModalVisible}
                  resultsForm={resultsForm}
                  members={teams}
                  isTeamModal
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
