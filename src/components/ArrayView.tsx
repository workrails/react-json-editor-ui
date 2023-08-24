import React, {useContext} from 'react'
import {ConfigContext} from '../store'
import AddItem from './AddItem'
import CollapsePart from './Collapse'
import ToolsView from './Tools'
import {getPlaceholder, isObject} from "../common";

type Props = {
  fieldValue: any[]
  fieldKey: string
  sourceData: any
  getValue: any
  deepLevel: number
  parentUniqueKey: string
}

function ArrayView(props: Props) {
  const { allowMap } = useContext(ConfigContext)
  return (
    <div className="arrayContent">
      <div style={{ marginTop: '8px' }}>
        {props.fieldValue.map((item: any, index: number) => {
          const uniqueKey = `${props.parentUniqueKey}-${index}`
          return (
            <div className="indexLine" key={uniqueKey}>
              <CollapsePart uniqueKey={uniqueKey} fieldValue={item} />
              {isObject(item) ? (
                <b style={{minHeight: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>{getPlaceholder(item)}</b>
              ) : null}
              {/*  <AutoComplete*/}
              {/*      style={{ width: 100 }}*/}
              {/*      size="small"*/}
              {/*      options={[{label: 'gosho', value: 'pseho'}]}*/}
              {/*  />*/}

                {!allowMap[uniqueKey] && (
                <span className="jsonValue">
                  {props.getValue(
                    item,
                    index,
                    props.fieldValue,
                    props.deepLevel + 1,
                    uniqueKey
                  )}
                </span>
              )}
              {
                <ToolsView
                  uniqueKey={uniqueKey}
                  fieldValue={item}
                  fieldKey={`${index}`}
                  sourceData={props.fieldValue}
                />
              }
            </div>
          )
        })}
      </div>
      <div>
        <AddItem
          key={props.parentUniqueKey}
          uniqueKey={props.parentUniqueKey}
          deepLevel={props.deepLevel}
          sourceData={props.fieldValue}
          fromArray
        />
      </div>
    </div>
  )
}
export default ArrayView
