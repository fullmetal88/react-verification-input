import React from 'react'

import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CodeInput } from './CodeInput'

describe('CodeInput', () => {
  const onChangeMock = jest.fn()
  const renderComponent = (props) => render(<CodeInput {...props} />)

  beforeEach(() => {
    renderComponent({ length: 6, onChange: onChangeMock, value: '' })
  })

  it('renders code input of proper length', () => {
    expect(screen.getAllByTestId(/verify-code-input-[0-9]*/)).toHaveLength(6)
  })

  it('calls onChange with proper value', async() => {
    await userEvent.click(screen.getByTestId('verify-code-input-0'))
    await userEvent.keyboard('123456')
    expect(onChangeMock).toHaveBeenCalledWith('123456')
  })

  it('does not accept non numeric or navigation characters', async() => {
    await userEvent.click(screen.getByTestId('verify-code-input-0'))
    await userEvent.keyboard('foobar')
    expect(onChangeMock).not.toHaveBeenCalledWith('foobar')
  })

  it('can navigate with arrows freely over populated portion of code', async() => {
    await userEvent.click(screen.getByTestId('verify-code-input-0'))
    await userEvent.keyboard('123')
    await userEvent.keyboard('{arrowLeft}{arrowLeft}')
    expect(screen.getByTestId('verify-code-input-1')).toHaveFocus()
    await userEvent.keyboard('{arrowRight}{arrowRight}')
    expect(screen.getByTestId('verify-code-input-3')).toHaveFocus()
  })

  describe('using number buttons', () => {
    beforeEach(async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-0'))
      await userEvent.keyboard('12')
    })

    it('populated cells with proper numbers', async() => {
      expect(screen.getByTestId('verify-code-input-0')).toHaveValue('1')
      expect(screen.getByTestId('verify-code-input-1')).toHaveValue('2')
    })

    it('navigates to next cell', async() => {
      expect(screen.getByTestId('verify-code-input-2')).toHaveFocus()
    })

    describe('when next cell is populated', () => {
      beforeEach(async() => {
        await userEvent.keyboard('{arrowLeft}{arrowLeft}')
        await userEvent.keyboard('3')
      })

      it('replace cell value with proper numbers', async() => {
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('3')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('2')
      })

      it('navigates to next empty cell', async() => {
        expect(screen.getByTestId('verify-code-input-2')).toHaveFocus()
      })
    })
  })

  describe('using delete button', () => {
    beforeEach(async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-0'))
      await userEvent.keyboard('12')
    })

    it('clears current cell', async() => {
      await userEvent.keyboard('{arrowLeft}{delete}')
      expect(screen.getByTestId('verify-code-input-0')).toHaveValue('1')
      expect(screen.getByTestId('verify-code-input-1')).toHaveValue('')
    })
  })

  describe('using backspace button', () => {
    beforeEach(async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-0'))
      await userEvent.keyboard('12')
    })

    describe('when current cell is populated', () => {
      beforeEach(async() => {
        await userEvent.keyboard('{arrowLeft}{backspace}')
      })

      it('clears current cell', async() => {
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('1')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('')
      })

      it('does not navigate', async() => {
        expect(screen.getByTestId('verify-code-input-1')).toHaveFocus()
      })
    })

    describe('when current cell is not populated', () => {
      beforeEach(async() => {
        await userEvent.keyboard('{backspace}')
      })

      it('clears last previous populated cell', async() => {
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('1')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('')
      })

      it('navigates to last previous populated cell', async() => {
        expect(screen.getByTestId('verify-code-input-1')).toHaveFocus()
      })
    })
  })

  describe('when pasting into input', () => {
    beforeEach(async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-0'))
    })

    describe('with proper pasted string', () => {
      it('populates input with pasted string', async() => {
        await userEvent.paste('123456')
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('1')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('2')
        expect(screen.getByTestId('verify-code-input-2')).toHaveValue('3')
        expect(screen.getByTestId('verify-code-input-3')).toHaveValue('4')
        expect(screen.getByTestId('verify-code-input-4')).toHaveValue('5')
        expect(screen.getByTestId('verify-code-input-5')).toHaveValue('6')
      })
    })

    describe('with invalid string', () => {
      it('does not populate input with too short string', async() => {
        await userEvent.paste('12345')
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-2')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-3')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-4')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-5')).toHaveValue('')
      })

      it('does not populate input with non numeric string', async() => {
        await userEvent.paste('foobar')
        expect(screen.getByTestId('verify-code-input-0')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-1')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-2')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-3')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-4')).toHaveValue('')
        expect(screen.getByTestId('verify-code-input-5')).toHaveValue('')
      })
    })
  })

  describe('focusing on input', () => {
    beforeEach(async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-0'))
      await userEvent.keyboard('123')
    })

    it('navigates to next empty cell', async() => {
      await userEvent.click(screen.getByTestId('verify-code-input-5'))
      expect(screen.getByTestId('verify-code-input-3')).toHaveFocus()
    })
  })
})
