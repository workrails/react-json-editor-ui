import {AutoComplete, Button, InputNumber, Select, Space} from '@workrails/ui'
import cloneDeep from 'lodash.clonedeep'
import React, {useContext, useState} from 'react'
import {ConfigContext, getNestedOption} from '../store'
import {DataType, labels, typeMap} from '../common'

const AddItem = (props: {
  uniqueKey: string
  sourceData: any
  deepLevel: number
  fromArray?: boolean
  accumulatedKey: string
}) => {
  const { setEditObject, editObject, optionsMap } = useContext(
    ConfigContext
  )

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
        const currentOptions = (getNestedOption(optionsMap, `${accumulatedKey}.${templateData[uniqueKey]?.['key']}`))
        return (
          <AutoComplete
            style={{ width: 100 }}
            size="small"
            options={currentOptions?.values}
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
                options={Object.entries(accumulatedKey
                    ? getNestedOption(optionsMap, accumulatedKey)?.nested ?? {}
                    : optionsMap
                ).map(([key, config]) => ({ value: key, label: config.label }))}
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
                label: labels[item],
              }))}
            />
          </div>
          {getTypeTemplate(templateData[uniqueKey]['type'] || DataType.STRING)}
          <div>
            <Space size={5}>
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
          {props.deepLevel === 1 && !props.fromArray ? 'Add Value' : '+ Row'}
        </Button>
      )}
    </div>
  )
}

export default AddItem
