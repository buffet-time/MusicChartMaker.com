import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Dialog from '../Dialog.vue'
const testText = 'this is a test'

describe('Back button should render without issue', () => {
	it('should render with close button without error', async () => {
		render(Dialog, {
			props: {
				dialogId: 'test',
				closeButton: true,
			},
			slots: {
				content: `<p> ${testText} </p>`,
			},
		})

		expect(screen.getByText(testText)).toBeTruthy()

		await fireEvent.click(screen.getByText('Close'))
	})

	it('should render without close button without error', async () => {
		render(Dialog, {
			props: {
				dialogId: 'test',
				closeButton: false,
			},
			slots: {
				content: `<p> ${testText} </p>`,
			},
		})

		expect(screen.getByText(testText)).toBeTruthy()
		expect(screen.queryByText('Close')).toBeFalsy()
	})
})
