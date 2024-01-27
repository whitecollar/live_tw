import { Button, Form, FormInstance, InputNumber, Modal } from 'antd'
import { FC } from 'react'
import { IRoundTableMember, ITeamRoundTableItem } from '../../types'
import { INewTableResult } from '../CompetitionTableItem'

interface IProps {
  isResultsModalVisible: boolean
  setIsResultsModalVisible: (payload: boolean) => void
  onResultsModalFinish: (values: INewTableResult) => void
  resultsForm: FormInstance<any>
  members: IRoundTableMember[] | ITeamRoundTableItem[]
  isTeamModal?: boolean
}

export const TableAddResultModal: FC<IProps> = ({
  isResultsModalVisible,
  onResultsModalFinish,
  resultsForm,
  setIsResultsModalVisible,
  members,
  isTeamModal = false,
}) => (
  <Modal
    visible={isResultsModalVisible}
    onCancel={() => setIsResultsModalVisible(false)}
    footer={null}
  >
    <Form
      form={resultsForm}
      onFinish={onResultsModalFinish}
      style={{ paddingTop: 10 }}
    >
      <p>Места {isTeamModal ? 'команд' : 'участников'} по Н/Н:</p>
      {members[0] && (
        <Form.Item
          name={isTeamModal ? 'teamPlace0' : 'memberPlace0'}
          rules={[{ required: true, message: 'Поле обязательно' }]}
          label={`${members[0].id}`}
        >
          <InputNumber min={1} max={4} />
        </Form.Item>
      )}
      {members[1] && (
        <Form.Item
          name={isTeamModal ? 'teamPlace1' : 'memberPlace1'}
          rules={[{ required: true, message: 'Поле обязательно' }]}
          label={`${members[1].id}`}
        >
          <InputNumber min={1} max={4} />
        </Form.Item>
      )}
      {members[2] && (
        <Form.Item
          name={isTeamModal ? 'teamPlace2' : 'memberPlace2'}
          rules={[{ required: true, message: 'Поле обязательно' }]}
          label={`${members[2].id}`}
        >
          <InputNumber min={1} max={4} />
        </Form.Item>
      )}
      {members[3] && (
        <Form.Item
          name={isTeamModal ? 'teamPlace3' : 'memberPlace3'}
          rules={[{ required: true, message: 'Поле обязательно' }]}
          label={`${members[3].id}`}
        >
          <InputNumber min={1} max={4} />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Подтвердить
        </Button>
      </Form.Item>
    </Form>
  </Modal>
)
