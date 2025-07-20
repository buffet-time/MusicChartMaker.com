import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import BackButton from '../BackButton.vue'

describe('Back button should render without issue', () => {
	it('should render Modal without error', async () => {
		render(BackButton, {
			props: {
				origin: 'Modal',
			},
		})

		expect(screen.getByRole('button')).toBeTruthy()
		expect(screen.getByRole('img')).toBeTruthy()

		await fireEvent.click(screen.getByRole('button'))
	})

	it('should render without error', async () => {
		render(BackButton, {
			props: {
				origin: 'Overlay',
			},
		})

		expect(screen.getByRole('button')).toBeTruthy()
		expect(screen.getByRole('img')).toBeTruthy()

		await fireEvent.click(screen.getByRole('button'))
	})
})
