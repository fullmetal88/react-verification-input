###Storybook demo
Try it youself at [Chromatic](https://main--635b7709c5f3c578f7a316c5.chromatic.com)

###Installation
````
npm i react-code-verification-input
````
###Usage
Use it as a controlled component, by suplying it with value and onChange value callback.
````
import React, { useState } from 'react'
import { CodeInput } from 'react-code-verification-input'

const [code, setCode] = useState('')

<CodeInput
  length={6}
  onChange={(value) => {
    setCode(value)
  }}
  value={code}
/>
````

###Component props

| Name | Type | Optional | Description |
| --- | --- | --- | --- |
| length | number | No | Lenght of the input.
| value | Text  | No | Value of input.
| onChange | Text  | No | Callback running after value is changed.
| cellClass | Text  | Yes | CSS class to override custom cell styling.
| containerClass | Text  | Yes | CSS class to override custom container styling.

