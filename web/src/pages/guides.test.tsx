import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FirstAidContent } from './FirstAid'
import { ShelterContent } from './Shelter'
import { FindingWaterContent } from './FindingWater'
import { SnaresContent } from './Snares'

describe('FirstAidContent', () => {
  it('renders its core sections', () => {
    render(<FirstAidContent />)
    expect(screen.getByText('First Aid')).toBeInTheDocument()
    expect(screen.getByText(/Severe Bleeding/)).toBeInTheDocument()
    expect(screen.getByText(/Snake Bite/)).toBeInTheDocument()
  })

  it('deliberately does not claim to identify medicinal plants', () => {
    render(<FirstAidContent />)
    expect(screen.getByRole('heading', { name: /Not Yet Covered Here/ })).toBeInTheDocument()
    expect(screen.getByText(/Misidentifying a plant/)).toBeInTheDocument()
  })
})

describe('ShelterContent', () => {
  it('renders a shelter option for each major climate', () => {
    render(<ShelterContent />)
    expect(screen.getByText(/Debris Hut/)).toBeInTheDocument()
    expect(screen.getByText(/Shade Shelter/)).toBeInTheDocument()
    expect(screen.getByText(/Quinzhee/)).toBeInTheDocument()
    expect(screen.getByText(/Lean-To/)).toBeInTheDocument()
  })
})

describe('FindingWaterContent', () => {
  it('renders the core techniques without asserting a fabricated dig depth', () => {
    render(<FindingWaterContent />)
    expect(screen.getByText(/Solar Still/)).toBeInTheDocument()
    expect(screen.getByText(/Transpiration Bag/)).toBeInTheDocument()
    expect(screen.getByText(/genuinely unpredictable without local data/)).toBeInTheDocument()
  })
})

describe('SnaresContent', () => {
  it('renders the core snare designs and a legal disclaimer', () => {
    render(<SnaresContent />)
    expect(screen.getByText(/Squirrel Pole/)).toBeInTheDocument()
    expect(screen.getByText(/Figure-4 Deadfall/)).toBeInTheDocument()
    expect(screen.getByText(/Trapping regulations vary/)).toBeInTheDocument()
  })
})
