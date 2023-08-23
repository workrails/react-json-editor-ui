import { AutoComplete, InputNumber, Select } from '@workrails/ui'
import React, { useState } from 'react'
import {
  DataType,
  getKeyList,
  getPlaceholder,
  getQuoteAddress,
  getTypeString,
  typeMap,
} from '../common'
import AddItem from './AddItem'
import { ConfigContext } from '../store'
import ArrayView from './ArrayView'
import ToolsView from './Tools'
import CollapsePart from './Collapse'

export type JsonViewProps = {
  setEditObject: any
  editObject: Record<string, any>
  options: string[]
  optionsMap?: Record<
    string,
    Array<{
      value: string
      label?: string
    }>
  >
}

function JsonView(props: JsonViewProps) {
  const { editObject, setEditObject, optionsMap = {}, options = [] } = props
  const [allowMap, setAllowMap] = useState<Record<string, boolean>>({})

  const syncData = (data: Record<string, any>) => {
    setEditObject({ ...data })
  }

  const onClickDelete = (key: string, sourceData: any) => {
    if (Array.isArray(sourceData)) {
      sourceData.splice(+key, 1)
    } else {
      Reflect.deleteProperty(sourceData, key)
    }
    syncData(editObject)
  }

  const onChangeType = (type: DataType, uniqueKey: string) => {
    const newEditObject = getQuoteAddress(
      typeMap[type],
      getKeyList(uniqueKey),
      editObject
    )
    syncData(newEditObject)
  }

  const onChangeKey = (
    value: string,
    currentKey: string,
    uniqueKey: string,
    source: Record<string, any>
  ) => {
    const newValue: Record<string, any> = {}
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key === currentKey) {
          newValue[value] = source[key]
        } else {
          newValue[key] = source[key]
        }
      }
    }

    const indexKeys = getKeyList(uniqueKey)
    const ROOT_LEVEL = 1
    if (indexKeys.length === ROOT_LEVEL) {
      syncData(newValue)
    } else {
      // remove last key equals set parent value
      indexKeys.pop()
      const newTotalData = getQuoteAddress(newValue, indexKeys, editObject)
      syncData(newTotalData)
    }
  }

  const onChangeValue = (
    value: any,
    key: string,
    source: Record<string, any>
  ) => {
    source[key] = value
    syncData(editObject)
  }

  const getValue = (
    fieldValue: any,
    fieldKey: string,
    sourceData: any,
    deepLevel: number,
    parentUniqueKey: string
  ) => {
    const thatType = getTypeString(fieldValue)
    switch (thatType) {
      case DataType.ARRAY:
        return (
          <ArrayView
            fieldValue={fieldValue}
            fieldKey={fieldKey}
            sourceData={sourceData}
            deepLevel={deepLevel}
            parentUniqueKey={parentUniqueKey}
            getValue={getValue}
          />
        )
      case DataType.OBJECT:
        return (
          <span>
            {renderJsonConfig(fieldValue, deepLevel + 1, parentUniqueKey)}
          </span>
        )
      case DataType.STRING:
        const currentOptions = optionsMap?.[fieldKey] ?? []
        return (
          <AutoComplete
            style={{ width: 100 }}
            size="small"
            options={currentOptions as { label: string; value: string }[]}
            value={fieldValue}
            onChange={(value: string) =>
              onChangeValue(value, fieldKey, sourceData)
            }
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
            placeholder={fieldValue}
            value={fieldValue}
            onBlur={event => {
              onChangeValue(+event.target.value, fieldKey, sourceData)
            }}
          />
        )
      case DataType.BOOLEAN:
        return (
          <Select
            size="small"
            style={{ width: '100px' }}
            defaultValue={Boolean(fieldValue)}
            onChange={(value: boolean) => {
              onChangeValue(value, fieldKey, sourceData)
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
    }
  }
  const onChangeAllow = (uniqueKey: string) => {
    allowMap[uniqueKey] = !allowMap[uniqueKey]
    setAllowMap({ ...allowMap })
  }
  const defaultLevel = 1
  const renderJsonConfig = (
    sourceData: any,
    deepLevel: number = defaultLevel,
    parentUniqueKey: string = `${deepLevel}`
  ) => {
    const keyList = Object.keys(sourceData)
    if (!keyList.length) {
      return (
        <div style={{ marginLeft: '18px' }}>
          <AddItem
            uniqueKey={'defaultKay'}
            deepLevel={deepLevel}
            sourceData={sourceData}
          />
        </div>
      )
    }
    return (
      <div
        className="objectContent"
        style={{ marginLeft: defaultLevel === deepLevel ? '0' : '28px' }}
      >
        <div style={{ marginTop: '8px' }}>
          {keyList.map((fieldKey, index) => {
            const uniqueKey = `${parentUniqueKey}-${index}`
            const fieldValue = sourceData[fieldKey]
            return (
              <div key={uniqueKey} className="indexLine">
                <CollapsePart uniqueKey={uniqueKey} fieldValue={fieldValue} />
                <span className="jsonKey">
                  <AutoComplete
                    style={{ width: 100 }}
                    size="small"
                    options={options.map(option => ({
                      value: option,
                      label: option,
                    }))}
                    onChange={value =>
                      onChangeKey(value, fieldKey, uniqueKey, sourceData)
                    }
                    value={fieldKey}
                    filterOption={(inputValue, option) =>
                      `${option!.value}`
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </span>
                <b>{getPlaceholder(fieldValue)}</b>
                {!allowMap[uniqueKey] && (
                  <span className="jsonValue">
                    {getValue(
                      fieldValue,
                      fieldKey,
                      sourceData,
                      deepLevel,
                      uniqueKey
                    )}
                  </span>
                )}
                <span className="toolsView">
                  {
                    <ToolsView
                      uniqueKey={uniqueKey}
                      fieldValue={fieldValue}
                      fieldKey={fieldKey}
                      sourceData={sourceData}
                    />
                  }
                </span>
              </div>
            )
          })}
        </div>
        <div>
          <AddItem
            key={parentUniqueKey}
            uniqueKey={parentUniqueKey}
            deepLevel={deepLevel}
            sourceData={sourceData}
          />
        </div>
      </div>
    )
  }

  return (
    <ConfigContext.Provider
      value={{
        editObject,
        setEditObject,
        optionsMap,
        options,

        onChangeType,
        onClickDelete,
        onChangeAllow,
        allowMap,
      }}
    >
      {renderJsonConfig(editObject)}
    </ConfigContext.Provider>
  )
}

export default JsonView
