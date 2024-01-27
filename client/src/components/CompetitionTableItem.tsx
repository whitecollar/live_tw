import { EditFilled, EyeOutlined } from '@ant-design/icons'
import { Button, Form, message } from 'antd'
import { FC, useEffect, useState } from 'react'
import { UseMutationResult } from 'react-query'
import { Link } from 'react-router-dom'
import appState from '../store/appState'
import { ICompetition, IRoundTableMember } from '../types'
import { checkIsAuth } from '../views/Login'
import {
  IAddTableRecordMutationArgs,
  IAddTableResultMutationArgs,
} from './CompetitionTable'
import { TableAddRecordModal } from './TableModals/TableAddRecordModal'
import { TableAddResultModal } from './TableModals/TableAddResultModal'

interface IProps {
  members: IRoundTableMember[]
  competitionId: string
  roundName: string
  itemIndex: number
  addTableResultMutation: UseMutationResult<
    ICompetition[],
    unknown,
    IAddTableResultMutationArgs,
    unknown
  >
  addTableRecordMutation: UseMutationResult<
    ICompetition[],
    unknown,
    IAddTableRecordMutationArgs,
    unknown
  >
  isSmallVersion: boolean
}

export interface INewTableRecord {
  memberId0: number
  memberId1: number
  memberId2: number
  memberId3: number
}

export interface INewTableResult {
  memberId0: number
  memberId1: number
  memberId2: number
  memberId3: number
  memberPlace0: number
  memberPlace1: number
  memberPlace2: number
  memberPlace3: number
}

export const CompetitionTableItem: FC<IProps> = ({
  members,
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

  const onNumbersModalFinish = (values: INewTableRecord) => {
    numbersForm.resetFields()
    setIsNumbersModalVisible(false)
    addTableRecordMutation.mutate({
      newRecord: values,
      competitionId,
      roundName,
      itemIndex,
    })
  }

  const onResultsModalFinish = (values: INewTableResult) => {
    resultsForm.resetFields()
    setIsResultsModalVisible(false)
    addTableResultMutation.mutate({
      newResult: {
        ...values,
        memberId0: members[0] && members[0].id,
        memberId1: members[1] && members[1].id,
        memberId2: members[2] && members[2].id,
        memberId3: members[3] && members[3].id,
      },
      competitionId,
      roundName,
      itemIndex,
    })
  }

  useEffect(() => {
    if (addTableResultMutation.data) {
      appState.setCompetitions(addTableResultMutation.data)
    }
  }, [addTableResultMutation.data])

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
                to={`/competitions/${competitionId}/table-item`}
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
                <td style={{ paddingRight: 10 }}>НН</td>
                <td style={{ paddingRight: 10, whiteSpace: 'nowrap' }}>
                  Фамилия Имя
                </td>
                <td style={{ paddingRight: 10 }}>Рег.</td>
                <td>Цвет</td>
                <td style={{ paddingLeft: 10 }}>Место</td>
              </tr>
            )}
            {members.map((member, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: member.id ? '' : '.5px solid #aaa',
                  height: 24.4,
                }}
              >
                <td style={{ paddingRight: 10, textAlign: 'center' }}>
                  {member.id ?? ''}
                </td>
                <td
                  style={{
                    minWidth: 100,
                    whiteSpace: 'nowrap',
                    paddingRight: 10,
                  }}
                >
                  {member.name ?? ''}
                </td>
                <td style={{ paddingRight: 10 }}>{member.city}</td>
                <td
                  style={{
                    minWidth: 34,
                    background:
                      member.color === 'red'
                        ? '#f5222d'
                        : member.color === 'green'
                        ? '#52c41a'
                        : member.color === 'blue'
                        ? '#096dd9'
                        : member.color === 'yellow'
                        ? '#fadb14'
                        : '',
                  }}
                />
                <td
                  style={{
                    fontWeight: 700,
                    paddingLeft: 10,
                    textAlign: 'center',
                  }}
                >
                  {member.place ?? ''}
                </td>
              </tr>
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
                        !members[0].id &&
                        !members[1].id &&
                        !members[2].id &&
                        !members[3].id
                      }
                    >
                      <EditFilled />
                    </Button>
                  </td>
                </tr>
                <TableAddRecordModal
                  isNumbersModalVisible={isNumbersModalVisible}
                  setIsNumbersModalVisible={setIsNumbersModalVisible}
                  onNumbersModalFinish={onNumbersModalFinish}
                  numbersForm={numbersForm}
                />
                <TableAddResultModal
                  onResultsModalFinish={onResultsModalFinish}
                  setIsResultsModalVisible={setIsResultsModalVisible}
                  isResultsModalVisible={isResultsModalVisible}
                  resultsForm={resultsForm}
                  members={members}
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
