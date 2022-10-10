import React, { FC, useState, useRef, useEffect } from 'react'

import styles from './CodeInput.module.scss'

type Props = {
  length: number
  onChange: (value: string) => void
  value: string
}

export const CodeInput: FC<Props> = ({
  length,
  onChange,
  value,
}) => {
  const [cellValues, setCellValues] = useState<number[]>(
    new Array(length).fill(undefined).map(
      (_cell, index) => {
        const cellValue = Number(value.split('')[index])
        return isNaN(cellValue) ? undefined : cellValue
      }
    )
  )
  const cellRefs = useRef([])

  useEffect(() => {
    onChange(cellValues.join(''))
  }, [cellValues])

  useEffect(() => {
    const find = findFirstPreviousEmptyCell(length)
    if (find > -1) {
      navigateToCell(find)
    } else {
      navigateToCell(length)
    }
  }, [cellValues])

  const onCodeChange = (e, index) => {
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      e.stopPropagation()

      // when user types in number
      if ((/^\d$/).test(e.key)) {
        populateCell(index, e.key)
        maybeNavigateRight(index)
      } else if (e.key === 'Backspace') {
        const cleared = clearCell(index)
        if (!cleared) {
          const find = findLastPreviousPopulatedCell(index)
          clearCell(find)
          navigateToCell(find)
        }
      } else if (e.key === 'Delete') {
        clearCell(index)
      } else if (e.key === 'ArrowRight') {
        navigateToCell(index + 1)
      } else if (e.key === 'ArrowLeft') {
        navigateToCell(index - 1)
      }
    }
  }

  const navigateToCell = (index) => {
    if (index < length && index >= 0) {
      cellRefs.current[index].focus()
    }
  }

  const populateCell = (index, value) => {
    setCellValues([
      ...cellValues.slice(0,index),
      value,
      ...cellValues.slice(index + 1),
    ])
  }

  const clearCell = (index) => {
    if (cellValues[index] === undefined) {
      return false
    }
    setCellValues([
      ...cellValues.slice(0,index),
      undefined,
      ...cellValues.slice(index + 1),
    ])
    return true
  }

  const findLastPreviousPopulatedCell = (index) => {
    let find = index
    cellValues.slice(0, index).forEach((el, index) => {
      if (el !== undefined) {
        find = index
      }
    })
    return find
  }

  const findFirstPreviousEmptyCell = (index) =>
    cellValues.slice(0, index).findIndex((el) => el === undefined)

  const maybeNavigateRight = (index) => {
    if (cellValues[index+1] === undefined) {
      navigateToCell(index+1)
    }
  }

  const onCodePaste = (e) => {
    e.preventDefault()

    const pastedNumber = e.clipboardData.getData('text')
    if (new RegExp('^[0-9]{' + length + '}$').test(pastedNumber)) {
      setCellValues(String(pastedNumber).split('').map((char) => Number(char)))
    }
  }

  const onCodeFocus = (e, index) => {
    e.preventDefault()

    const find = findFirstPreviousEmptyCell(index)
    navigateToCell(find > -1 ? find : index)
  }

  return (
    <div className={styles.cellContainer}>
      {Array.from(Array(length).keys()).map((index) => (
        <input
          data-testid={`verify-code-input-${index}`}
          key={index}
          className={styles.cell}
          tabIndex={index === 0 ? 0 : -1}
          onChange={() => null}
          onKeyDown={(e) => onCodeChange(e, index)}
          onPaste={(e) => onCodePaste(e)}
          onFocus={(e) => onCodeFocus(e, index)}
          ref={(element) => { cellRefs.current[index] = element }}
          inputMode='numeric'
          value={cellValues[index] || ''}
        />
      ))}
    </div>
  )
}
