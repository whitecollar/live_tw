import { FC, useEffect } from 'react'
import { Layout, message } from 'antd'
import { Content, Footer } from 'antd/lib/layout/layout'
import { Routes, Route } from 'react-router-dom'
import HeaderComponent from './components/Header'
import LoginPage from './views/Login'
import HomePage from './views/Home'
import CompetitionPage from './views/Competition'
import appState from './store/appState'
import { useQuery } from 'react-query'
import axios from 'axios'
import { ICompetition, ITeamCompetition } from './types'
import { SERVER_ADDRESS } from './config'
import TableItem from './views/TableItem'
import { observer } from 'mobx-react-lite'
import { TeamCompetitionPage } from './views/TeamCompetitionPage'
import { TeamTableItem } from './views/TeamTableItem'

const AppRoute: FC = observer(() => {
  const { data: competitions, error: competitionsError } = useQuery(
    'competitions',
    async () =>
      (await axios.get<ICompetition[]>(`${SERVER_ADDRESS}/competitions`)).data,
    { refetchInterval: 10000, refetchIntervalInBackground: true },
  )

  const { data: teamCompetitions, error: teamCompetitionsError } = useQuery(
    'team-competitions',
    async () =>
      (
        await axios.get<ITeamCompetition[]>(
          `${SERVER_ADDRESS}/team-competitions`,
        )
      ).data,
    { refetchInterval: 10000, refetchIntervalInBackground: true },
  )

  useEffect(() => {
    if (competitionsError) {
      message.error('Произошла ошибка при загрузке данных')
    }
  }, [competitionsError])

  useEffect(() => {
    if (competitions) {
      appState.setCompetitions(competitions)
    }
  }, [competitions])

  useEffect(() => {
    if (teamCompetitionsError) {
      message.error('Произошла ошибка при загрузке данных')
    }
  }, [teamCompetitionsError])

  useEffect(() => {
    if (teamCompetitions) {
      appState.setTeamCompetitions(teamCompetitions)
    }
  }, [teamCompetitions])

  return (
    <Layout
      style={{
        background: appState.isDarkBg ? '#434343' : '#d9d9d9',
        minHeight: '100vh',
      }}
    >
      <HeaderComponent />
      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/competitions/:id" element={<CompetitionPage />} />
          <Route path="/competitions/:id/table-item" element={<TableItem />} />
          <Route
            path="/team-competitions/:id"
            element={<TeamCompetitionPage />}
          />
          <Route
            path="/team-competitions/:id/table-item"
            element={<TeamTableItem />}
          />
        </Routes>
      </Content>
      <Footer
        style={{
          background: '#595959',
          color: '#fff',
          padding: '5px 7vw',
        }}
      >
        Created by TimingWeb © 2022
      </Footer>
    </Layout>
  )
})

export default AppRoute
