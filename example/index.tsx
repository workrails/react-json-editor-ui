
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import JsonEditor from '../src'

const App = () => {
  const [editObject, setEditObject] = React.useState<any>({
    name: 'may',
    age: null,
    address: [
      'Panyu Shiqiao on Canton',
      'Tianhe',
      {
        city: 'forida meta 11',
      },
    ],
    others: {
      id: 1246,
      joinTime: '2017-08-20. 10:20',
      description: 'another',
    },
  })

  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '50px 0' }}>
        React Json Edit
      </h1>
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
            onChange={data => {
              setEditObject(data)
            }}
            options={['Price', 'Hours']}
            optionsMap={{
              color: [
                { value: 'red', label: 'Red' },
                { value: 'blue', label: 'Blue' },
              ],
              city: [
                { value: 'beijing', label: 'Beijing' },
                { value: 'shanghai', label: 'Shanghai' },
              ],
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
            whiteSpace: 'pre'
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(editObject, null, 3)
          }}

        >
          
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
