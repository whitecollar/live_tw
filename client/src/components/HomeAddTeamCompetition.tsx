import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
} from 'antd'
import { FC, useState } from 'react'
import { UseMutationResult } from 'react-query'
import readXlsxFile from 'read-excel-file'
import {
  IInputTeamCompetition,
  ITeamCompetition,
  ITeamCompetitionFormValues,
} from '../types'

interface IProps {
  newCompetitionMutation: UseMutationResult<
    ITeamCompetition[],
    unknown,
    IInputTeamCompetition,
    unknown
  >
}

export const HomeAddTeamCompetition: FC<IProps> = ({
  newCompetitionMutation,
}) => {
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
    isQualification,
  }: ITeamCompetitionFormValues) => {
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
      title,
      subtitle,
      place,
      sport,
      isQualification,
      teams: startTableRows.map((startListRow) => ({
        id: startListRow[0] as number,
        title: startListRow[1] as string,
        region: startListRow[2] as string,
        id0: startListRow[3] as number,
        name0: startListRow[4] as string,
        id1: startListRow[5] as number,
        name1: startListRow[6] as string,
      })),
      rounds,
    })
  }

  return (
    <>
      <Button
        onClick={handleAddCompetitionClick}
        type="primary"
        style={{ marginTop: 15 }}
      >
        Создать новое командное событие
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
              <Form.Item name="isQualification" label="Квалификация" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </div>
            <div>
              <Form.List name="rounds">
                {(fields, { add, remove }) => (
                  <>
                    <p>Финалы:</p>
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
                        Добавить финал
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
