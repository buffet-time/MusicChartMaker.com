import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import SelectChartDropdown from '../SelectChartDropdown.vue'
const testText = 'testText'
const testArray = ['Name 1', 'Name 2', 'Name 3']

describe('Back button should render without issue', () => {
	it('should render from sidebar without error', async () => {
		render(SelectChartDropdown, {
			props: {
				chartNamesArray: testArray,
				chartSelectLabel: testText,
				initiator: 'Sidebar',
			},
		})

		screen.debug()

		testArray.forEach((name) => {
			expect(screen.getByText(name)).toBeTruthy()
		})
	})

	it('should render from import/export without error', async () => {
		render(SelectChartDropdown, {
			props: {
				chartNamesArray: testArray,
				chartSelectLabel: testText,
				initiator: 'MusicChartMakerExport',
			},
		})

		testArray.forEach((name) => {
			expect(screen.getByText(name)).toBeTruthy()
		})
	})
})
