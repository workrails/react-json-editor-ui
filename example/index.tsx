import * as React from 'react'
import * as ReactDOM from 'react-dom'

import JsonEditor from '../src'

const App = () => {
  const [editObject, setEditObject] = React.useState<any>({
    salesforce: {
      SBQQ__Quote__c: {
        SBQQ__Price__c: '',
      },
    },
  })

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
              foo: {
                label: 'Foo',
                values: [{ value: 'asdf', label: 'pesho' }],
              },
              salesforce: {
                label: 'Salesforce',
                nested: {
                  SBQQ__Quote__c: {
                    label: 'Quote',
                    nested: {
                      SBQQ__Price__c: {
                        label: 'Price',
                        values: [
                          { value: 1, label: 'one' },
                          { value: 2, label: 'two' },
                        ],
                      },
                    },
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
