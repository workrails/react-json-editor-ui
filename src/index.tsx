import 'antd/dist/antd.min.css'
import './styles/index.less'
import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import JsonView from './components/JsonView'

export type JsonEditorProps = {
  width?: number | string
  data: Record<string, any>
  optionsMap?: Record<
    string,
    Array<{
      value: string
      label?: string
    }>
  >
  options: string[]
  onChange: (data: any) => void
}

function JsonEditor(props: JsonEditorProps) {
  const [editObject, setEditObject] = useState<any>(cloneDeep(props.data))
  useEffect(() => {
    props.onChange(editObject)
  }, [editObject])

  return (
    <div className="jsonEditorContainer" style={{ width: props.width ?? 500 }}>
      <JsonView
        {...{
          editObject,
          setEditObject,
          optionsMap: props.optionsMap,
          options: props.options,
        }}
      />
    </div>
  )
}

export default JsonEditor
