import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import JsonView from './components/JsonView'
import { styled, Global, css } from '@workrails/ui'
import { OptionsMap } from './store'

export type JsonEditorProps = {
  width?: number | string
  data: Record<string, any>
  optionsMap?: OptionsMap
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
      style={{ width: props.width ?? '100%' }}
    >
      <JsonView
        {...{
          editObject,
          setEditObject,
          optionsMap: props.optionsMap,
        }}
      />
      <Global styles={css`
        .json-editor-popup.ant-select-dropdown {
          min-width: 100px !important;
          width: fit-content !important;
        }
      `} />
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
      margin-right: 5px;
    }
    .arrayContent {
      margin-left: 28px;
    }
  }

  .indexLine {
    position: relative;
    margin-top: 8px;
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
