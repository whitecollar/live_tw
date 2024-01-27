import { Table } from 'antd'
import { FC } from 'react'
import { ITeamCompetition } from '../../types'
import { checkIsAuth } from '../../views/Login'
import { formatTime } from '../ResultsList'
import { TableAddListResult } from '../TableModals/TableAddResult'

interface IProps {
  competition: ITeamCompetition
}

export const TeamCompetitionResultsList: FC<IProps> = ({ competition }) => {
  const tableColumns = [
    {
      title: 'Место',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Команда',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Регион',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'НН (1)',
      dataIndex: 'id0',
      key: 'id0',
    },
    {
      title: 'ФИО (1)',
      dataIndex: 'name0',
      key: 'name0',
    },
    {
      title: 'Заезд 1',
      dataIndex: 'firstRound',
      key: 'firstRound',
    },
    {
      title: 'НН (2)',
      dataIndex: 'id1',
      key: 'id1',
    },
    {
      title: 'ФИО (2)',
      dataIndex: 'name1',
      key: 'name1',
    },
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

  const tableSource =
    competition.qualificationResults &&
    competition.qualificationResults.map((result) => ({
      ...result,
      firstRound: result.firstRound ? formatTime(result.firstRound) : '',
      secondRound: result.secondRound ? formatTime(result.secondRound) : '',
      result: result.result ? formatTime(result.result) : '',
      key: result.id,
    }))

  return (
    <div>
      {checkIsAuth() && <TableAddListResult competition={competition} />}
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
              <td style={{ paddingRight: 3 }}>Команда</td>
              <td style={{ paddingRight: 3 }}>Рег.</td>
              <td style={{ paddingRight: 3 }}>Заезд 1</td>
              <td style={{ paddingRight: 3 }}>Заезд 2</td>
              <td style={{ paddingRight: 3 }}>Рез-т</td>
            </tr>
            {competition.qualificationResults &&
              competition.qualificationResults.map(
                ({
                  id,
                  title,
                  firstRound,
                  place,
                  result,
                  secondRound,
                  region,
                }) => (
                  <tr key={id}>
                    <td style={{ fontWeight: 700, textAlign: 'center' }}>
                      {place}
                    </td>
                    <td style={{ textAlign: 'center' }}>{id}</td>
                    <td>{title}</td>
                    <td>{region}</td>
                    <td style={{ fontSize: 10 }}>
                      {firstRound ? formatTime(firstRound) : ''}
                    </td>
                    <td style={{ fontSize: 10 }}>
                      {secondRound ? formatTime(secondRound) : ''}
                    </td>
                    <td style={{ fontSize: 10 }}>
                      {result ? formatTime(result) : ''}
                    </td>
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
