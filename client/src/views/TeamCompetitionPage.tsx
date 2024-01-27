import { Button, Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TeamCompetitionResultsList } from '../components/TeamCompetition/TeamCompetitionResultsList'
import { TeamCompetitionTable } from '../components/TeamCompetition/TeamCompetitionTable'
import appState from '../store/appState'
import { ITeamCompetition } from '../types'

export const TeamCompetitionPage: FC = observer(() => {
  const [competition, setCompetition] = useState<ITeamCompetition | null>(null)
  const params = useParams()
  const [displayType, setDisplayType] = useState<'table' | 'list'>('list')

  useEffect(() => {
    const foundedCompetition =
      appState.teamCompetitions.find(({ _id }) => params.id === _id) ?? null

    setCompetition(foundedCompetition)
    // eslint-disable-next-line
  }, [params.id, appState.teamCompetitions])

  useEffect(() => {
    const shortcutHandler = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'm') {
        setDisplayType(displayType === 'list' ? 'table' : 'list')
      }
    }

    document.addEventListener('keydown', shortcutHandler)

    return () => {
      document.removeEventListener('keydown', shortcutHandler)
    }
  }, [displayType])

  return !competition ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '80vh',
      }}
    >
      <p style={{ fontSize: 20 }}>Событие не найдено</p>
      <Link to={'/'}>
        <Button type="primary">Вернуться на главную</Button>
      </Link>
    </div>
  ) : (
    <div style={{ padding: '30px 5vw', overflow: 'auto' }}>
      <h2 style={{ textTransform: 'uppercase', fontSize: 22, margin: 0 }}>
        {competition.title}
      </h2>
      <p style={{ fontSize: 17, margin: '8px 0 20px' }}>
        Место проведения: {competition.place}
      </p>
      {competition.isQualification && (
        <div>
          <Radio.Group
            onChange={(e) => setDisplayType(e.target.value)}
            value={displayType}
            buttonStyle="solid"
            style={{ marginBottom: 10 }}
          >
            <Radio.Button value={'list'}>Квалификации</Radio.Button>
            <Radio.Button value={'table'}>Финалы</Radio.Button>
          </Radio.Group>
        </div>
      )}
      {displayType === 'list' && competition.isQualification ? (
        <TeamCompetitionResultsList competition={competition} />
      ) : (
        <TeamCompetitionTable competition={competition} />
      )}
    </div>
  )
})
