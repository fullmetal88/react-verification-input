import React, { useState } from 'react'
import { CodeInput } from './CodeInput'

export default {
  decorators: [
    Story => (<Story />),
  ], title: 'Core / Code Input',
}

export const CodeInputStory = () => {
  const [value, setValue] = useState('')
  return (
    <>
      <div style={{ width: '100%' }}>
        <CodeInput
          length={6}
          onChange={(changedValue) => setValue(changedValue)}
          value={value}
        />
      </div>
    </>
  )
}

CodeInputStory.storyName = 'Code Input'
