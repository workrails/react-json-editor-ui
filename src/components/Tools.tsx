import { MinusSquareOutlined } from '@workrails/ui'
import { Select } from '@workrails/ui'
import React from 'react'
import { ConfigContext } from '../store'
import {getTypeString, DataType, labels} from '../common'

function ToolsView(props: {
  fieldValue: any
  fieldKey: string
  uniqueKey: string
  sourceData: any
}) {
  return (
    <ConfigContext.Consumer>
      {({ onChangeType, onClickDelete }) => (
        <span className="tools">
          <span>
            <Select
              size="small"
              style={{ width: '100px' }}
              onChange={value => onChangeType(value, props.uniqueKey)}
              defaultValue={getTypeString(props.fieldValue)}
              options={Object.values(DataType).map(item => ({
                value: item,
                label: labels[item],
              }))}
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
      )}
    </ConfigContext.Consumer>
  )
}
export default ToolsView
