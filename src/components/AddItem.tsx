import { AutoComplete, Button, InputNumber, Select, Space } from '@workrails/ui'
import cloneDeep from 'lodash.clonedeep'
import React, { useContext, useState } from 'react'
import { ConfigContext, getKeys, getNestedOption } from '../store'
import { DataType, labels, typeMap } from '../common'

const AddItem = (props: {
  uniqueKey: string
  sourceData: any
  deepLevel: number
  fromArray?: boolean
  accumulatedKey: string
}) => {
  const { setEditObject, editObject, optionsMap } = useContext(ConfigContext)

  const { uniqueKey, sourceData, accumulatedKey } = props
  const isArray = Array.isArray(sourceData)
  const [templateData, setTemplateData] = useState<any>({})
  const [showIncreaseMap, setShowIncreaseMap] = useState<any>({})

  const onClickIncrease = (key: string, value: boolean) => {
    showIncreaseMap[key] = value
    templateData[key] = {}
    setTemplateData({
      ...templateData,
    })
    setShowIncreaseMap({
      ...showIncreaseMap,
    })
  }

  const changeInputKey = (uniqueKey: string, value: string) => {
    templateData[uniqueKey]['key'] = value

    const fixedType = getNestedOption(optionsMap, `${accumulatedKey}.${value}`)
      ?.type
    const type: DataType =
      fixedType ?? templateData[uniqueKey]['type'] ?? DataType.STRING

    templateData[uniqueKey]['type'] = type
    templateData[uniqueKey]['value'] = cloneDeep(typeMap[type])
    templateData[uniqueKey]['fixedType'] = !!fixedType

    setTemplateData({ ...templateData })
  }

  const changeInputValue = (uniqueKey: string, value: any) => {
    templateData[uniqueKey]['value'] = value
    setTemplateData({ ...templateData })
  }

  const onChangeTempType = (uniqueKey: string, type: DataType) => {
    templateData[uniqueKey]['type'] = type
    templateData[uniqueKey]['value'] = cloneDeep(typeMap[type])
    setTemplateData({
      ...templateData,
    })
  }

  const onConfirmIncrease = (uniqueKey: any, sourceData: any) => {
    const { key, value } = cloneDeep(templateData[uniqueKey])
    if (isArray) {
      sourceData.push(value)
    } else {
      sourceData[key] = value
    }
    setEditObject({ ...editObject })
    onClickIncrease(uniqueKey, false)
  }

  const getTypeTemplate = (type: DataType) => {
    switch (type) {
      case DataType.STRING:
        const key = templateData[uniqueKey]?.['key']
        const currentOptions = key
          ? getNestedOption(optionsMap, `${accumulatedKey}.${key}`)
          : { values: [] }
        return (
          <AutoComplete
            style={{ width: 100 }}
            size="small"
            options={currentOptions?.values}
            onChange={(value) => changeInputValue(uniqueKey, value)}
            filterOption={(inputValue, option) =>
              `${option!.value}`
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        )
      case DataType.NUMBER:
        return (
          <InputNumber
            size="small"
            style={{ width: '100px' }}
            onBlur={(event) => changeInputValue(uniqueKey, +event.target.value)}
          />
        )
      case DataType.BOOLEAN:
        return (
          <Select
            size="small"
            style={{ width: '100px' }}
            defaultValue={true}
            onChange={(value: boolean) => {
              changeInputValue(uniqueKey, value)
            }}
            options={[
              {
                value: true as any,
                label: 'Yes',
              },
              {
                value: false as any,
                label: 'No',
              },
            ]}
          />
        )
      default:
        return null
    }
  }

  const template = templateData[uniqueKey]
  const type: DataType = template?.['type']

  return (
    <div
      className="addItem"
      key={uniqueKey}
      style={{
        marginTop: 8,
      }}
    >
      {showIncreaseMap[uniqueKey] ? (
        <Space size={5}>
          {!isArray && (
            <div>
              <AutoComplete
                style={{ width: 100 }}
                size="small"
                options={getKeys(optionsMap, accumulatedKey)}
                onChange={(value) => changeInputKey(uniqueKey, value)}
                filterOption={(inputValue, option) =>
                  `${option!.value}`
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
          )}
          <div>
            <Select
              size="small"
              style={{ width: '100px' }}
              onChange={(value) => onChangeTempType(uniqueKey, value)}
              value={type}
              defaultValue={DataType.STRING}
              options={
                template?.['fixedType']
                  ? [{ value: type, label: labels[type] }]
                  : Object.values(DataType).map((item) => ({
                      value: item,
                      label: labels[item],
                    }))
              }
            />
          </div>
          {getTypeTemplate(type)}
          <div>
            <Space size={5}>
              <Button
                size="small"
                type="primary"
                disabled={!template?.['key'] && !isArray}
                onClick={() => onConfirmIncrease(uniqueKey, sourceData)}
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={() => onClickIncrease(uniqueKey, false)}
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Space>
      ) : (
        <Button
          type="primary"
          size="small"
          onClick={() => onClickIncrease(uniqueKey, true)}
        >
          {props.fromArray ? '+ Entry' : '+ Field'}
        </Button>
      )}
    </div>
  )
}

export default AddItem
