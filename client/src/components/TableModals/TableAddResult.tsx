import { FC, useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Form,
  InputNumber,
  Space,
  Select,
  message,
  Radio,
  Input,
} from 'antd'
import { useMutation } from 'react-query'
import axios from 'axios'
import { observer } from 'mobx-react-lite'
import { ITeamCompetition } from '../../types'
import { SERVER_ADDRESS } from '../../config'
import appState from '../../store/appState'

interface INewResult {
  number: number
  round: string
  min: number
  sec: number
  ms: number | string
}

interface IProps {
  competition: ITeamCompetition
}

export const TableAddListResult: FC<IProps> = observer(
  ({ competition: { _id: competitionId } }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const addResultMutation = useMutation(
      async (newResult: INewResult) =>
        (
          await axios.post<ITeamCompetition[]>(
            `${SERVER_ADDRESS}/team-competitions/add-list-result/`,
            {
              competitionId,
              ...newResult,
            },
          )
        ).data,
    )

    if (addResultMutation.error) {
      message.error('Произошла ошибка при добавлении результата')
    }

    useEffect(() => {
      if (addResultMutation.data) {
        appState.setTeamCompetitions(addResultMutation.data)
      }
    }, [addResultMutation.data])

    const onFinish = (values: INewResult) => {
      if (isNaN(+values.ms) || +values.ms < 0 || +values.ms > 999) {
        message.error('Некорректный ввод миллисекунд')
        return
      }

      const ms =
        `${values.ms}`.length === 1
          ? +values.ms * 100
          : `${values.ms}`.length === 2
          ? +values.ms * 10
          : +values.ms

      addResultMutation.mutate({ ...values, ms })
      form.resetFields()
      setIsModalVisible(false)
    }

    return (
      <>
        <Button
          style={{ marginBottom: 20 }}
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          Добавить результат
        </Button>
        <Modal
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form
            onFinish={onFinish}
            form={form}
            style={{ paddingTop: 40 }}
            initialValues={{ round: '1' }}
          >
            <Space>
              <Form.Item
                name="number"
                label="Номер команды"
                rules={[{ required: true, message: 'Поле обязательно' }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
              <Form.Item
                name="round"
                label="Номер заезда"
                rules={[{ required: true, message: 'Поле обязательно' }]}
              >
                <Select>
                  <Select.Option key="1" value="1">
                    1
                  </Select.Option>
                  <Select.Option key="2" value="2">
                    2
                  </Select.Option>
                </Select>
              </Form.Item>
            </Space>
            <p>Результат:</p>
            <Space>
              <Form.Item name="min" label="мин">
                <InputNumber min={0} max={1000} />
              </Form.Item>
              <Form.Item name="sec" label="сек">
                <InputNumber min={0} max={59} />
              </Form.Item>
              <Form.Item name="ms" label="мс">
                <Input min={0} max={999} />
              </Form.Item>
            </Space>
            <Form.Item name="status" label="Статус">
              <Radio.Group>
                <Radio value={'DNS'}>DNS</Radio>
                <Radio value={'DNF'}>DNF</Radio>
                <Radio value={'DSQ'}>DSQ</Radio>
                <Radio value={undefined}>Нет</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Подтвердить
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  },
)
