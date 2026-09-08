import { describe, expect, it } from 'vitest'
import {
  CONTOUR_BASICS,
  TERRAIN_SHAPES,
  SLOPE_AND_STEEPNESS,
  PRACTICAL_USES,
  COMMON_MISTAKES,
  type TopoGuideSection,
} from './topoGuideData'

function expectValidSections(sections: TopoGuideSection[]) {
  expect(sections.length).toBeGreaterThan(0)
  sections.forEach((section) => {
    expect(section.title.trim().length).toBeGreaterThan(0)
    expect(section.bullets.length).toBeGreaterThan(0)
    section.bullets.forEach((bullet) => expect(bullet.trim().length).toBeGreaterThan(0))
  })
}

describe('topoGuideData', () => {
  it('CONTOUR_BASICS: every section has a title and at least one non-empty bullet', () => {
    expectValidSections(CONTOUR_BASICS)
  })

  it('TERRAIN_SHAPES: every section has a title and at least one non-empty bullet', () => {
    expectValidSections(TERRAIN_SHAPES)
  })

  it('SLOPE_AND_STEEPNESS: every section has a title and at least one non-empty bullet', () => {
    expectValidSections(SLOPE_AND_STEEPNESS)
  })

  it('PRACTICAL_USES: every section has a title and at least one non-empty bullet', () => {
    expectValidSections(PRACTICAL_USES)
  })

  it('COMMON_MISTAKES: every section has a title and at least one non-empty bullet', () => {
    expectValidSections(COMMON_MISTAKES)
  })

  it('has no duplicate section titles within any single category', () => {
    for (const sections of [CONTOUR_BASICS, TERRAIN_SHAPES, SLOPE_AND_STEEPNESS, PRACTICAL_USES, COMMON_MISTAKES]) {
      const titles = sections.map((s) => s.title)
      expect(new Set(titles).size).toBe(titles.length)
    }
  })
})
