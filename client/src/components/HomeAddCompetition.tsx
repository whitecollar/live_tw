import { FC, useState } from 'react'
import { Button, Modal, Form, Input, message, InputNumber, Space } from 'antd'
import {
  ICompetition,
  ICompetitionFormValues,
  IInputCompetition,
} from '../types'
import readXlsxFile from 'read-excel-file'
import { UseMutationResult } from 'react-query'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface IProps {
  newCompetitionMutation: UseMutationResult<
    ICompetition[],
    unknown,
    IInputCompetition,
    unknown
  >
}

export const HomeAddCompetition: FC<IProps> = ({ newCompetitionMutation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [startListFile, setStartListFile] = useState<null | File>(null)
  const [form] = Form.useForm()

  const handleAddCompetitionClick = () => {
    setIsModalVisible(true)
  }

  const onFinish = async ({
    title,
    subtitle,
    place,
    sport,
    rounds,
    qualificationRounds,
  }: ICompetitionFormValues) => {
    if (!startListFile) {
      message.error('Загрузите старт-лист таблицу')
      return
    }

    let startTableRows
    try {
      startTableRows = await readXlsxFile(startListFile)
    } catch (error) {
      message.error('Старт лист таблица не валидна')
      return
    }
    form.resetFields()
    setIsModalVisible(false)
    newCompetitionMutation.mutate({
      isTwoRoundsInQualification: qualificationRounds === 2,
      title,
      subtitle,
      place,
      sport,
      rounds,
      members: startTableRows.map((startListRow) => ({
        id: startListRow[0] as string,
        name: startListRow[1] as string,
        city: startListRow[2] as string,
      })),
    })
  }

  return (
    <>
      <Button
        onClick={handleAddCompetitionClick}
        type="primary"
        style={{ marginTop: 15, marginRight: 20 }}
      >
        Создать новое событие
      </Button>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
      >
        <Form onFinish={onFinish} form={form}>
          <div
            style={{
              display: 'grid',
              gap: '5px 10px',
              gridTemplate: '1fr 1fr / 1fr 1fr',
              paddingTop: 40,
            }}
          >
            <Form.Item
              label="Название"
              name="title"
              rules={[{ required: true, message: 'Поле обязательно' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Вид спорта"
              name="sport"
              rules={[{ required: true, message: 'Поле обязательно' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Подзаголовок"
              name="subtitle"
              rules={[{ required: true, message: 'Поле обязательно' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Место"
              name="place"
              rules={[{ required: true, message: 'Поле обязательно' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div
            style={{ height: 0.5, background: '#878787', marginBottom: 20 }}
          />
          <div
            style={{
              display: 'grid',
              gap: '5px 10px',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div>
              <Form.Item
                name="group"
                label="Группа"
                rules={[{ required: true, message: 'Поле обязательно' }]}
              >
                <Input placeholder="Мужчины" />
              </Form.Item>
              <Form.Item
                name="startTable"
                label="Загрузить старт-лист таблицу"
                required
              >
                <Input
                  onChange={(event) => {
                    event.target.files &&
                      setStartListFile(event.target.files[0])
                  }}
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </Form.Item>
              <Form.Item
                name="qualificationRounds"
                label="Кол-во заездов в квалификации"
                rules={[{ required: true, message: 'Поле обязательно' }]}
              >
                <InputNumber min={1} max={2} />
              </Form.Item>
            </div>
            <div>
              <Form.List name="rounds">
                {(fields, { add, remove }) => (
                  <>
                    <p>Квалификации:</p>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          style={{ marginBottom: 10 }}
                          {...restField}
                          name={[name, 'roundName']}
                          rules={[
                            { required: true, message: 'Поле обязательно' },
                          ]}
                        >
                          <Input placeholder="Финал" />
                        </Form.Item>
                        <Form.Item
                          style={{ marginBottom: 10 }}
                          label="Кол-во заездов:"
                          {...restField}
                          name={[name, 'roundSize']}
                          rules={[
                            { required: true, message: 'Поле обязательно' },
                          ]}
                        >
                          <InputNumber min={1} />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Добавить раунд
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Подтвердить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
