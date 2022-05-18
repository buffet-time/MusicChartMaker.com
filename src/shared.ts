import { type ChartState, type DragDataTransfer } from './types'

// This is a wrapper around the Fetch WebAPI to handle errors without any fuss
export async function ProperFetch(url: string): Promise<any | null> {
	try {
		const response = await fetch(url)

		if (response.ok) {
			return await response.json()
		} else {
			console.error('Responded with an error:' + (await response.json()))
			return null
		}
	} catch (error) {
		console.error(`Error in fetch call: ${error}`)
		return null
	}
}

export function GenerateDefaultChart(): ChartState {
	return {
		options: {
			chartSize: { length: 3, width: 3 },
			chartTitle: 'New Album Chart',
			displayNumberRank: false,
			displayTitles: false,
			displayPlaycount: false
		},
		chartTiles: []
	}
}

export function DragSetData(
	dragEvent: DragEvent,
	objectToTransfer: DragDataTransfer
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	dragEvent.dataTransfer!.setData(
		'text/plain',
		JSON.stringify(objectToTransfer)
	)
}
