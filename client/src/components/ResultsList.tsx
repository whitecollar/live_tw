import { Table } from 'antd'
import { FC } from 'react'
import { ICompetition } from '../types'
import { checkIsAuth } from '../views/Login'
import { AddListResult } from './AddListResult'

interface IProps {
  competition: ICompetition
}

export const formatTime = (timeMs: number | string): string => {
  if (typeof timeMs === 'string') {
    return timeMs
  }

  const mins =
    `${Math.floor(timeMs / 60000)}`.length === 1
      ? `0${Math.floor(timeMs / 60000)}`
      : Math.floor(timeMs / 60000)
  const secs =
    `${Math.floor((timeMs % 60000) / 1000)}`.length === 1
      ? `0${Math.floor((timeMs % 60000) / 1000)}`
      : Math.floor((timeMs % 60000) / 1000)
  const ms =
    `${timeMs % 1000}`.length === 1
      ? `00${timeMs % 1000}`
      : `${timeMs % 1000}`.length === 2
      ? `0${timeMs % 1000}`
      : timeMs % 1000

  return `${mins}:${secs},${ms}`
}

export const ResultsList: FC<IProps> = ({ competition }) => {
  const rounds = competition.rounds.map(({ roundName }) => roundName)
  const activeRound =
    competition.rounds.find(({ roundName: name }) => name === rounds[0]) ??
    competition.rounds[0]

  let tableColumns = [
    {
      title: 'Место',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'н/н',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Фамилия, имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Регион',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: competition.isTwoRoundsInQualification ? 'Заезд 1' : 'Результат',
      dataIndex: 'firstRound',
      key: 'firstRound',
    },
  ]

  if (competition.isTwoRoundsInQualification) {
    tableColumns = [
      ...tableColumns,
      {
        title: 'Заезд 2',
        dataIndex: 'secondRound',
        key: 'secondRound',
      },
      {
        title: 'Результат',
        dataIndex: 'result',
        key: 'result',
      },
    ]
  }

  const tableSource = activeRound?.results.map((result) => ({
    ...result,
    firstRound: result.firstRound ? formatTime(result.firstRound) : '',
    secondRound: result.secondRound ? formatTime(result.secondRound) : '',
    result: result.result ? formatTime(result.result) : '',
    key: result.id,
  }))

  return (
    <div>
      {checkIsAuth() && (
        <AddListResult roundName={rounds[0]} competition={competition} />
      )}
      {window.innerWidth < 700 ? (
        <table
          style={{
            borderRadius: 2,
            background: '#fff',
            padding: 2,
            width: '100%',
          }}
        >
          <tbody style={{ whiteSpace: 'nowrap', fontSize: 11.5 }}>
            <tr style={{ fontWeight: 700 }}>
              <td style={{ paddingRight: 3, textAlign: 'center' }}>Место</td>
              <td style={{ paddingRight: 3, textAlign: 'center' }}>НН</td>
              <td style={{ paddingRight: 3 }}>Фамилия Имя</td>
              <td style={{ paddingRight: 3 }}>Рег.</td>
              {competition.isTwoRoundsInQualification ? (
                <>
                  <td style={{ paddingRight: 3 }}>Заезд 1</td>
                  <td style={{ paddingRight: 3 }}>Заезд 2</td>
                  <td style={{ paddingRight: 3 }}>Рез-т</td>
                </>
              ) : (
                <td style={{ paddingRight: 3 }}>Рез-т</td>
              )}
            </tr>
            {activeRound.results.map(
              ({ id, name, firstRound, place, result, secondRound, city }) => (
                <tr key={id}>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>
                    {place}
                  </td>
                  <td style={{ textAlign: 'center' }}>{id}</td>
                  <td>{name}</td>
                  <td>{city}</td>
                  {competition.isTwoRoundsInQualification ? (
                    <>
                      <td style={{ fontSize: 10 }}>
                        {firstRound ? formatTime(firstRound) : ''}
                      </td>
                      <td style={{ fontSize: 10 }}>
                        {secondRound ? formatTime(secondRound) : ''}
                      </td>
                      <td style={{ fontSize: 10 }}>
                        {result ? formatTime(result) : ''}
                      </td>
                    </>
                  ) : (
                    <td style={{ fontSize: 10 }}>
                      {firstRound ? formatTime(firstRound) : ''}
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      ) : (
        <div>
          <Table
            dataSource={tableSource}
            columns={tableColumns}
            pagination={false}
            size={'small'}
          />
        </div>
      )}
    </div>
  )
}
