import { Button, Modal } from 'antd'
import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import appState from '../store/appState'
import { observer } from 'mobx-react-lite'
import { useMutation } from 'react-query'
import axios from 'axios'
import {
  ICompetition,
  IInputCompetition,
  IInputTeamCompetition,
  ITeamCompetition,
} from '../types'
import { SERVER_ADDRESS } from '../config'
import { HomeAddCompetition } from '../components/HomeAddCompetition'
import { checkIsAuth } from './Login'
import { HomeAddTeamCompetition } from '../components/HomeAddTeamCompetition'

const HomePage: FC = observer(() => {
  const newCompetitionMutation = useMutation(
    async (newCompetition: IInputCompetition) =>
      (
        await axios.post<ICompetition[]>(
          `${SERVER_ADDRESS}/competitions/`,
          newCompetition,
        )
      ).data,
  )
  const deleteCompetitionMutation = useMutation(
    async ({ id }: { id: string }) =>
      (
        await axios.delete<ICompetition[]>(
          `${SERVER_ADDRESS}/competitions?id=${id}`,
        )
      ).data,
  )

  const newTeamCompetitionMutation = useMutation(
    async (newCompetition: IInputTeamCompetition) =>
      (
        await axios.post<ITeamCompetition[]>(
          `${SERVER_ADDRESS}/team-competitions`,
          newCompetition,
        )
      ).data,
  )

  const deleteTeamCompetitionMutation = useMutation(
    async ({ id }: { id: string }) =>
      (
        await axios.delete<ITeamCompetition[]>(
          `${SERVER_ADDRESS}/team-competitions?id=${id}`,
        )
      ).data,
  )

  useEffect(() => {
    if (newCompetitionMutation.data) {
      appState.setCompetitions(newCompetitionMutation.data)
    }
  }, [newCompetitionMutation.data])

  useEffect(() => {
    if (deleteCompetitionMutation.data) {
      appState.setCompetitions(deleteCompetitionMutation.data)
    }
  }, [deleteCompetitionMutation.data])

  useEffect(() => {
    if (newTeamCompetitionMutation.data) {
      appState.setTeamCompetitions(newTeamCompetitionMutation.data)
    }
  }, [newTeamCompetitionMutation.data])

  useEffect(() => {
    if (deleteTeamCompetitionMutation.data) {
      appState.setTeamCompetitions(deleteTeamCompetitionMutation.data)
    }
  }, [deleteTeamCompetitionMutation.data])

  return (
    <div style={{ padding: '30px 10vw' }}>
      {appState.competitions.map(
        ({ _id: id, place, sport, subtitle, title }) => (
          <Link
            to={`/competitions/${id}`}
            key={id}
            style={{
              background: '#fafafa',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              borderRadius: 3,
              padding: '8px 12px',
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  textTransform: 'uppercase',
                  fontSize: 24,
                  margin: '0 0 10px',
                }}
              >
                {title}
              </h2>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 21,
                  color: '#0050b3',
                }}
              >
                {sport}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontSize: 18, color: '#262626' }}>{subtitle}</div>
              <div style={{ fontSize: 18, color: '#262626' }}>{place}</div>
            </div>
            {checkIsAuth() && (
              <div style={{ marginTop: 15 }}>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    Modal.confirm({
                      content: `Вы точно хотите удалить событие ${title}?`,
                      onOk: () => deleteCompetitionMutation.mutate({ id }),
                      okText: 'Подтвердить',
                      cancelText: 'Отменить',
                    })
                  }}
                  danger
                >
                  Удалить событие
                </Button>
              </div>
            )}
          </Link>
        ),
      )}
      {appState.teamCompetitions.map(
        ({ _id: id, place, sport, subtitle, title }) => (
          <Link
            to={`/team-competitions/${id}`}
            key={id}
            style={{
              background: '#fafafa',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              borderRadius: 3,
              padding: '8px 12px',
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  textTransform: 'uppercase',
                  fontSize: 24,
                  margin: '0 0 10px',
                }}
              >
                {title}
              </h2>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 21,
                  color: '#0050b3',
                }}
              >
                {sport}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontSize: 18, color: '#262626' }}>{subtitle}</div>
              <div style={{ fontSize: 18, color: '#262626' }}>{place}</div>
            </div>
            {checkIsAuth() && (
              <div style={{ marginTop: 15 }}>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    Modal.confirm({
                      content: `Вы точно хотите удалить событие ${title}?`,
                      onOk: () => deleteTeamCompetitionMutation.mutate({ id }),
                      okText: 'Подтвердить',
                      cancelText: 'Отменить',
                    })
                  }}
                  danger
                >
                  Удалить событие
                </Button>
              </div>
            )}
          </Link>
        ),
      )}
      {checkIsAuth() && (
        <div>
          <HomeAddCompetition newCompetitionMutation={newCompetitionMutation} />
          <HomeAddTeamCompetition
            newCompetitionMutation={newTeamCompetitionMutation}
          />
        </div>
      )}
    </div>
  )
})

export default HomePage
