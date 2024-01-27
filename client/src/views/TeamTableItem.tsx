import { Button } from 'antd'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import appState from '../store/appState'
import { ITeamRoundTableItem } from '../types'

export const TeamTableItem: FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const competitionId = params.id
  const [item, setItem] = useState<ITeamRoundTableItem[]>([])
  const fullscreenItemRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (!appState.tableItem.index && !appState.tableItem.roundName) {
      navigate(-1)
    }

    appState.teamCompetitions.forEach((competition) => {
      if (competition._id === competitionId) {
        competition.rounds.forEach((round) => {
          if (round.roundName === appState.tableItem.roundName) {
            round.tableResults.forEach((result, resIndex) => {
              if (resIndex === appState.tableItem.index) {
                setItem(result)
              }
            })
          }
        })
      }
    })
  }, [competitionId, navigate])

  useEffect(() => {
    fullscreenItemRef.current?.requestFullscreen()
  }, [])

  return (
    <div
      ref={fullscreenItemRef}
      style={{
        padding: '1vw 3vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        style={{ position: 'fixed', top: 10, left: 10, zIndex: 1 }}
        size="large"
      >
        Назад
      </Button>
      <table
        style={{
          background: '#fff',
          borderRadius: 2,
          transform: window.innerWidth < 700 ? 'scale(1.3)' : 'scale(2.5)',
        }}
      >
        <tbody>
          <tr style={{ fontWeight: 600 }}>
            <td style={{ textAlign: 'center' }}>№</td>
            <td style={{ padding: '0 3vw', whiteSpace: 'nowrap' }}></td>
            <td style={{ paddingRight: '3vw' }}>Рег.</td>
            <td>Цвет</td>
            <td style={{ paddingLeft: '3vw' }}>Место</td>
          </tr>
          {item.map((team, index) => (
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
                <td style={{ paddingLeft: '1vw', textAlign: 'center' }}>
                  {team.id}
                </td>
                <td
                  style={{
                    minWidth: 100,
                    whiteSpace: 'nowrap',
                    padding: '0 3vw',
                  }}
                >
                  {team.title}
                </td>
                <td style={{ paddingRight: '3vw' }}>
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
                <td style={{ paddingLeft: '3vw' }}></td>
              </tr>
              <tr
                key={index * 3 - 1}
                style={{
                  borderBottom: team.id ? '' : '.5px solid #aaa',
                  height: 24.4,
                }}
              >
                <td style={{ textAlign: 'center', paddingLeft: '1vw' }}>
                  {team.id0}
                </td>
                <td style={{ padding: '0 3vw' }}>{team.name0}</td>
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
                    paddingLeft: '3vw',
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
                <td style={{ textAlign: 'center', paddingLeft: '1vw' }}>
                  {team.id1}
                </td>
                <td style={{ padding: '0 3vw' }}>{team.name1}</td>
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
        </tbody>
      </table>
    </div>
  )
}
