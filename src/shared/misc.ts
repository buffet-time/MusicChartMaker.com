import type { SiteOptions } from '#types'
import { GlobalChartState } from '#shared/globals'

export const GrayBoxImg = 'https://i.imgur.com/5IYcmZz.jpg'
export const FillerAlbum = {
	artist: 'Artist',
	name: 'Album',
	image: GrayBoxImg
}

export function GenerateDefaultSiteOptions(): SiteOptions {
	return {
		numberOfSearchResults: 10,
		currentChart: 'New Album Chart'
	}
}

export function IsImage(input: string): Promise<boolean> {
	// returns a Promise that'll resolve to a boolean whether or not an input is an image
	return new Promise((resolve) => {
		const image = new Image()
		image.onerror = image.onabort = () => resolve(false)
		image.onload = () => resolve(true)
		image.src = input
	})
}

export function getAlbumNumber(indexOne: number, indexTwo: number): number {
	if (!GlobalChartState) {
		console.error(
			'Error getting GlobalChartState in getAlbumNumber()',
			GlobalChartState
		)
		return 0
	}
	let returnValue = 0

	for (let x = 0; x < indexOne; x++) {
		returnValue += GlobalChartState.options.chartSize.rowSizes[x]
	}

	return returnValue + 1 + indexTwo
}

// This is a wrapper around the Fetch() WebAPI to handle errors without any fuss
export async function ProperFetch(
	input: RequestInfo | URL,
	init?: RequestInit | undefined
): Promise<any | null> {
	try {
		const response = await fetch(input, init)

		if (response.ok) {
			return await response.json()
		}

		console.error(
			`Fetch from ${input} responded with an error: ${await response.json()}`
		)
		return null
	} catch (error) {
		console.error(`Error in fetch from ${input}: ${error}`)
		return null
	}
}
