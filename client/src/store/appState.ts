import { makeAutoObservable } from 'mobx'
import { ICompetition, ITeamCompetition } from '../types'

interface ITableItem {
  index: number | null
  roundName: string | null
}

class AppState {
  competitions: ICompetition[] = []
  teamCompetitions: ITeamCompetition[] = []
  tableItem: ITableItem = { index: null, roundName: null }
  isDarkBg = false

  constructor() {
    makeAutoObservable(this)
  }

  setCompetitions(competitions: ICompetition[]) {
    this.competitions = competitions
  }

  setTeamCompetitions(teamCompetitions: ITeamCompetition[]) {
    this.teamCompetitions = teamCompetitions
  }

  setTableItem(tableItem: ITableItem) {
    this.tableItem = tableItem
  }

  setIsDarkBg(isDarkBg: boolean) {
    this.isDarkBg = isDarkBg
  }
}

export default new AppState()
