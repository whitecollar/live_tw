import { Button, Form, FormInstance, InputNumber, Modal, Space } from 'antd'
import { FC } from 'react'
import { INewTableRecord } from '../CompetitionTableItem'

interface IProps {
  isNumbersModalVisible: boolean
  setIsNumbersModalVisible: (payload: boolean) => void
  onNumbersModalFinish: (values: INewTableRecord) => void
  numbersForm: FormInstance<any>
  isTeamModal?: boolean
}

export const TableAddRecordModal: FC<IProps> = ({
  isNumbersModalVisible,
  setIsNumbersModalVisible,
  onNumbersModalFinish,
  numbersForm,
  isTeamModal = false,
}) => (
  <Modal
    visible={isNumbersModalVisible}
    onCancel={() => setIsNumbersModalVisible(false)}
    footer={null}
  >
    <Form
      form={numbersForm}
      onFinish={onNumbersModalFinish}
      style={{ paddingTop: 10 }}
    >
      <p>Первый участник:</p>
      <Space>
        <Form.Item
          name={isTeamModal ? 'teamId0' : 'memberId0'}
          label={`Номер ${isTeamModal ? 'команды' : 'участника'}`}
        >
          <InputNumber min={1} />
        </Form.Item>
        <div
          style={{
            position: 'relative',
            top: -12,
            borderRadius: 2,
            background: '#f5222d',
            width: 40,
            height: 30,
            marginLeft: 30,
          }}
        />
      </Space>
      <p>Второй участник:</p>
      <Space>
        <Form.Item
          name={isTeamModal ? 'teamId1' : 'memberId1'}
          label={`Номер ${isTeamModal ? 'команды' : 'участника'}`}
        >
          <InputNumber min={1} />
        </Form.Item>
        <div
          style={{
            position: 'relative',
            top: -12,
            borderRadius: 2,
            background: '#52c41a',
            width: 40,
            height: 30,
            marginLeft: 30,
          }}
        />
      </Space>
      <p>Третий участник:</p>
      <Space>
        <Form.Item
          name={isTeamModal ? 'teamId2' : 'memberId2'}
          label={`Номер ${isTeamModal ? 'команды' : 'участника'}`}
        >
          <InputNumber min={1} />
        </Form.Item>
        <div
          style={{
            position: 'relative',
            top: -12,
            borderRadius: 2,
            background: '#096dd9',
            width: 40,
            height: 30,
            marginLeft: 30,
          }}
        />
      </Space>
      <p>Четвертый участник:</p>
      <Space>
        <Form.Item
          name={isTeamModal ? 'teamId3' : 'memberId3'}
          label={`Номер ${isTeamModal ? 'команды' : 'участника'}`}
        >
          <InputNumber min={1} />
        </Form.Item>
        <div
          style={{
            position: 'relative',
            top: -12,
            borderRadius: 2,
            background: '#fadb14',
            width: 40,
            height: 30,
            marginLeft: 30,
          }}
        />
      </Space>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Подтвердить
        </Button>
      </Form.Item>
    </Form>
  </Modal>
)
