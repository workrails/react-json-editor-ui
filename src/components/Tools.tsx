import { MinusSquareOutlined } from '@workrails/ui'
import { Select } from '@workrails/ui'
import React, { useContext } from 'react'
import { ConfigContext, getNestedOption } from '../store'
import { getTypeString, DataType, labels } from '../common'

function ToolsView(props: {
  fieldValue: any
  fieldKey: string
  uniqueKey: string
  sourceData: any
  accumulatedKey: string
}) {
  const { optionsMap, onChangeType, onClickDelete } = useContext(ConfigContext)
  const option = getNestedOption(optionsMap, props.accumulatedKey)
  const type = getTypeString(props.fieldValue)
  return (
    <span className="tools">
      <span>
        <Select
          size="small"
          style={{ width: '100px' }}
          onChange={(value) => onChangeType(value, props.uniqueKey)}
          value={option?.type ? option.type : type}
          options={
            option?.type
              ? [{ value: option.type, label: labels[option.type] }]
              : Object.values(DataType).map((item) => ({
                  value: item,
                  label: labels[item],
                }))
          }
        />
      </span>
      <span className="iconSubtraction">
        <MinusSquareOutlined
          rev
          style={{ color: '#E74C3C' }}
          onClick={() => onClickDelete(props.fieldKey, props.sourceData)}
        />
      </span>
    </span>
  )
}

export default ToolsView
