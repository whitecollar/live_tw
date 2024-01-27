import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import appState from '../store/appState'
import { IRoundTableMember } from '../types'

const TableItemPage: FC = observer(() => {
  const navigate = useNavigate()
  const params = useParams()
  const competitionId = params.id
  const [item, setItem] = useState<IRoundTableMember[]>([])
  const fullscreenItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!appState.tableItem.index && !appState.tableItem.roundName) {
      navigate(-1)
    }

    appState.competitions.forEach((competition) => {
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
      style={{
        padding: '1vw 3vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={fullscreenItemRef}
    >
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        style={{ position: 'fixed', top: 10, left: 10 }}
        size="large"
      >
        Назад
      </Button>
      <table
        style={{
          padding: 15,
          borderRadius: 2,
          background: '#fff',
          transform: 'scale(1.15)',
        }}
      >
        <tbody style={{ fontSize: '4vw', padding: 15 }}>
          <tr style={{ fontWeight: 600 }}>
            <td style={{ paddingRight: '3vw' }}>НН</td>
            <td style={{ paddingRight: '3vw', whiteSpace: 'nowrap' }}>
              Фамилия Имя
            </td>
            <td style={{ paddingRight: '3vw' }}>Рег.</td>
            <td>Цвет</td>
            <td style={{ paddingLeft: '3vw' }}>Место</td>
          </tr>
          {item.map((itemRow, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center', paddingRight: '3vw' }}>
                {itemRow.id}
              </td>
              <td
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '3vw',
                }}
              >
                {itemRow.name}
              </td>
              <td style={{ paddingRight: '3vw' }}>{itemRow.city}</td>
              <td
                style={{
                  background:
                    itemRow.color === 'red'
                      ? '#f5222d'
                      : itemRow.color === 'green'
                      ? '#52c41a'
                      : itemRow.color === 'blue'
                      ? '#096dd9'
                      : itemRow.color === 'yellow'
                      ? '#fadb14'
                      : '',
                  paddingRight: '3vw',
                }}
              />
              <td
                style={{
                  fontWeight: 700,
                  textAlign: 'center',
                  paddingRight: '3vw',
                }}
              >
                {itemRow.place ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
export default TableItemPage
