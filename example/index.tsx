import * as React from 'react'
import * as ReactDOM from 'react-dom'

import JsonEditor from '../src'
import { DataType } from '../src/common'

const App = () => {
  const [editObject, setEditObject] = React.useState<any>({})

  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '50px 0' }}>React Json Edit</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '550px',
            padding: '10px',
            marginRight: '2px',
            boxShadow: '0px 0px 10px #eee',
            borderRadius: '2px',
            paddingLeft: '25px',
          }}
        >
          <JsonEditor
            data={editObject}
            onChange={(data) => {
              setEditObject(data)
            }}
            optionsMap={{
              SBQQ__Quote__c: {
                label: 'SBQQ__Quote__c',
                values: [{ value: 'asdf', label: 'pesho' }],
              },
              salesforce: {
                label: 'Salesforce',
                type: DataType.OBJECT,
                allowCustomKeys: false,
                options: {
                  SBQQ__Quote__c: {
                    label: 'Quote',
                    type: DataType.OBJECT,
                    options: {
                      SBQQ__Price__c: {
                        label: 'Price',
                        type: DataType.NUMBER,
                      },
                      SBQQ__Category__c: {
                        label: 'Category',
                        type: DataType.STRING,
                        allowCustomValues: false,
                        values: [
                          {
                            label: 'Maikati',
                            value: 'bashtati',
                          },
                        ],
                      },
                    },
                  },
                  SBQQ__Opportunity: {
                    label: 'Opportunity',
                    type: DataType.OBJECT,
                  },
                },
              },
            }}
          />
        </div>
        <div
          style={{
            width: '550px',
            padding: '10px',
            marginLeft: '2px',
            boxShadow: '0px 0px 10px #eee',
            borderRadius: '2px',
            whiteSpace: 'pre',
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(editObject, null, 3),
          }}
        ></div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
