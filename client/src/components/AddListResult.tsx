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
import { SERVER_ADDRESS } from '../config'
import { ICompetition } from '../types'
import { observer } from 'mobx-react-lite'
import appState from '../store/appState'

interface INewResult {
  number: number
  round: string
  min: number
  sec: number
  ms: number | string
  status?: string
}

interface IProps {
  roundName: string
  competition: ICompetition
}

export const AddListResult: FC<IProps> = observer(
  ({
    roundName,
    competition: { _id: competitionId, isTwoRoundsInQualification },
  }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const addResultMutation = useMutation(
      async (newResult: INewResult) =>
        (
          await axios.post<ICompetition[]>(
            `${SERVER_ADDRESS}/competitions/add-list-result/`,
            {
              roundName,
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
        appState.setCompetitions(addResultMutation.data)
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

      if (!isTwoRoundsInQualification) {
        values.round = '1'
      }

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
                label="Номер участника"
                rules={[{ required: true, message: 'Поле обязательно' }]}
              >
                <InputNumber min={0} max={1000} />
              </Form.Item>
              {isTwoRoundsInQualification && (
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
              )}
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
