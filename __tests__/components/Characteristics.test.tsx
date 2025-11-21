import { render, screen, fireEvent } from '@testing-library/react'
import { Characteristics } from '@/components/character/Characteristics'
import { Characteristics as CharacteristicsType } from '@/types/character'

const mockCharacteristics: CharacteristicsType = {
    WS: { initial: 30, advances: 0 },
    BS: { initial: 30, advances: 0 },
    S: { initial: 30, advances: 0 },
    T: { initial: 30, advances: 0 },
    I: { initial: 30, advances: 0 },
    Ag: { initial: 30, advances: 0 },
    Dex: { initial: 30, advances: 0 },
    Int: { initial: 30, advances: 0 },
    WP: { initial: 30, advances: 0 },
    Fel: { initial: 30, advances: 0 },
}

describe('Characteristics Component', () => {
    it('renders all characteristics', () => {
        const handleChange = jest.fn()
        render(<Characteristics characteristics={mockCharacteristics} onChange={handleChange} />)

        // Check if headers are present
        expect(screen.getByText('WS')).toBeInTheDocument()
        expect(screen.getByText('BS')).toBeInTheDocument()
        expect(screen.getByText('S')).toBeInTheDocument()
        // ... check others if needed
    })

    it('calls onChange when input changes', () => {
        const handleChange = jest.fn()
        render(<Characteristics characteristics={mockCharacteristics} onChange={handleChange} />)

        // Find the initial value input for WS (first input in the first row of inputs)
        // Since there are many inputs, we can try to find by display value if unique, or by role
        // Here all are 30. Let's get all inputs and pick the first one which should be WS Initial
        const inputs = screen.getAllByRole('spinbutton')
        const wsInitialInput = inputs[0]

        fireEvent.change(wsInitialInput, { target: { value: '35' } })

        expect(handleChange).toHaveBeenCalledTimes(1)
        const expectedChars = { ...mockCharacteristics }
        expectedChars.WS = { ...expectedChars.WS, initial: 35 }
        expect(handleChange).toHaveBeenCalledWith(expectedChars)
    })

    it('displays correct totals', () => {
        const charsWithAdvances = {
            ...mockCharacteristics,
            WS: { initial: 30, advances: 10 }
        }
        const handleChange = jest.fn()
        render(<Characteristics characteristics={charsWithAdvances} onChange={handleChange} />)

        // Total row should have 40 for WS
        // We can look for the cell containing 40
        expect(screen.getByText('40')).toBeInTheDocument()
    })
})
