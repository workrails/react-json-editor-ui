import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import JsonView from './components/JsonView'
import { styled } from '@workrails/ui'

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
    <Wrapper
      className="jsonEditorContainer"
      style={{ width: props.width ?? 500 }}
    >
      <JsonView
        {...{
          editObject,
          setEditObject,
          optionsMap: props.optionsMap,
          options: props.options,
        }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  line-height: 1;
  font-size: 12px;

  .objectContent,
  .arrayContent {
    position: relative;

    .jsonKey,
    .jsonValue {
      margin-right: 10px;
    }
    .arrayContent {
      margin-left: 20px;
    }
  }

  .indexLine {
    position: relative;
    margin-bottom: 5px;
  }

  .tools {
    position: absolute;
    right: 0;
    top: 0;

    .iconSubtraction {
      margin-left: 10px;
    }
  }

  .addItem {
    display: flex;
    margin-top: 10px;
  }

  .mt15 {
    display: inline-block;
    margin-top: 7px;
  }

  .collapse {
    position: relative;

    &.down {
      transition: transform 0.2s ease;
      transform: rotate(270deg);
    }

    &.up {
      transition: transform 0.2s ease;
      transform: rotate(360deg);
    }
  }
`

export default JsonEditor
