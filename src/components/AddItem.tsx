import {
  AutoComplete,
  Button,
  Col,
  InputNumber,
  Select,
  Space,
} from '@workrails/ui'
import cloneDeep from 'lodash.clonedeep'
import React from 'react'
import { useContext, useState } from 'react'
import { ConfigContext } from '../store'
import { DataType, typeMap } from '../common'

const AddItem = (props: {
  uniqueKey: string
  sourceData: any
  deepLevel: number
  fromArray?: boolean
}) => {
  const { setEditObject, editObject, optionsMap, options = [] } = useContext(
    ConfigContext
  )

  const { uniqueKey, sourceData } = props
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
    setTemplateData({ ...templateData })
  }

  const changeInputValue = (uniqueKey: string, value: any) => {
    templateData[uniqueKey]['value'] = value
    setTemplateData({ ...templateData })
  }

  const onChangeTempType = (uniqueKey: string, type: DataType) => {
    templateData[uniqueKey]['type'] = type
    templateData[uniqueKey]['value'] = typeMap[type]
    setTemplateData({
      ...templateData,
    })
  }

  const onConfirmIncrease = (uniqueKey: any, sourceData: any) => {
    const { key: aKey, value } = cloneDeep(templateData[uniqueKey])
    if (isArray) {
      sourceData.push(value)
    } else {
      sourceData[aKey] = value
    }
    setEditObject({ ...editObject })
    onClickIncrease(uniqueKey, false)
  }

  const getTypeTemplate = (type: DataType) => {
    switch (type) {
      case DataType.STRING:
        const currentOptions =
          optionsMap?.[templateData[uniqueKey]?.['key']] ?? []
        return (
          <AutoComplete
            style={{ width: 100 }}
            size="small"
            options={currentOptions}
            onChange={value => changeInputValue(uniqueKey, value)}
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
            onBlur={event => changeInputValue(uniqueKey, +event.target.value)}
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
                label: 'true',
              },
              {
                value: false as any,
                label: 'false',
              },
            ]}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="addItem"
      key={uniqueKey}
      style={{
        marginTop: isSourceEmpty(props.sourceData) ? 0 : 12,
      }}
    >
      {showIncreaseMap[uniqueKey] ? (
        <Space>
          {!isArray && (
            <div>
              <AutoComplete
                style={{ width: 100 }}
                size="small"
                options={options.map((option: string) => ({
                  value: option,
                  label: option,
                }))}
                onChange={value => changeInputKey(uniqueKey, value)}
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
              onChange={value => onChangeTempType(uniqueKey, value)}
              defaultValue={DataType.STRING}
              options={Object.values(DataType).map(item => ({
                value: item,
                label: item,
              }))}
            />
          </div>
          {getTypeTemplate(templateData[uniqueKey]['type'] || DataType.STRING)}
          <div>
            <Space>
              <Button
                size="small"
                type="primary"
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
          {props.deepLevel === 1 && !props.fromArray ? 'Add Value' : '+ row'}
        </Button>
      )}
    </div>
  )
}

const isSourceEmpty = (source: any) => {
  return typeof source === 'object' && !Object.keys(source).length
}

export default AddItem
