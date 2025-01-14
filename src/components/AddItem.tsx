import { Button, InputNumber, Space } from '@workrails/ui'
import cloneDeep from 'lodash.clonedeep'
import React, { useContext, useState } from 'react'
import { ConfigContext, getKeys, getOptionByKey } from '../store'
import { DataType, labels, typeMap } from '../common'
import { Select } from './Select'
import { Select as WorkRailsSelect } from '@workrails/ui'

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

    const fixedType = getOptionByKey(optionsMap, `${accumulatedKey}.${value}`)
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
          ? getOptionByKey(optionsMap, `${accumulatedKey}.${key}`)
          : { values: [], allowCustomValues: true }
        return (
          <Select
            allowCustom={currentOptions?.allowCustomValues}
            style={{ minWidth: 100 }}
            size="small"
            popupClassName="json-editor-popup"
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
            onBlur={(event) => changeInputValue(uniqueKey, +event.target.value)}
          />
        )
      case DataType.BOOLEAN:
        return (
          <WorkRailsSelect
            size="small"
            style={{ minWidth: 100 }}
            popupClassName="json-editor-popup"
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
  const type: DataType = template?.['type'] ?? DataType.STRING
  const option = getOptionByKey(optionsMap, accumulatedKey)
  const nestedOptionsMap = accumulatedKey ? option?.options ?? {} : optionsMap

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
              <Select
                allowCustom={option?.allowCustomKeys}
                style={{ minWidth: 100 }}
                popupClassName="json-editor-popup"
                size="small"
                options={getKeys(nestedOptionsMap)}
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
            <WorkRailsSelect
              size="small"
              style={{ minWidth: 100 }}
              popupClassName="json-editor-popup"
              onChange={value => onChangeTempType(uniqueKey, value)}
              value={type}
              disabled={!!template?.['fixedType']}
              options={
                template?.['fixedType']
                  ? [{ value: type, label: labels[type] }]
                  : Object.values(DataType).map(item => ({
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
