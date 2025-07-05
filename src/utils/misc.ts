import type { AlbumTile, JSONReturnType, SiteOptions } from '#types'
import { GlobalChartState } from '#utils/globals'
import { top42, top100 } from '#utils/chart'

// This is weird looking but streamlines functionality tbh
const grayBoxImgur = 'https://i.imgur.com/5IYcmZz'
// for usage as the placeholder boxes
export const GrayBoxImgForPlaceholder = `${grayBoxImgur}.jpg`
// Comes back from the API
export const GrayBoxImgFromApi = `${grayBoxImgur}.jpeg`

export const FillerAlbum: AlbumTile = {
	artist: 'Artist',
	name: 'Album',
	image: GrayBoxImgForPlaceholder,
}

export function GenerateDefaultSiteOptions(): SiteOptions {
	return {
		numberOfSearchResults: 12,
		currentChart: 'New Album Chart',
		presets: [top42, top100],
	}
}

export function IsImage(url: string): Promise<boolean> {
	// returns a Promise that'll resolve to a boolean whether or not a url is an image
	return new Promise((resolve) => {
		const image = new Image()
		image.onerror = image.onabort = () => resolve(false)
		image.onload = () => resolve(true)
		image.src = url
	})
}

export function getAlbumNumber(indexOne: number, indexTwo: number): number {
	if (!GlobalChartState) {
		console.error(
			'Error getting GlobalChartState in getAlbumNumber()',
			GlobalChartState,
		)
		return 0
	}
	let returnValue = 0

	for (let x = 0; x < indexOne; x++) {
		returnValue += GlobalChartState.value.options.chartSize.rowSizes[x]
	}

	return returnValue + 1 + indexTwo
}

// This is a wrapper around the Fetch() WebAPI to handle errors without any fuss
export async function ProperFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<JSONReturnType> {
	try {
		const response = await fetch(input, init)

		if (response.ok) {
			return (await response.json()) as Promise<JSONReturnType>
		}

		console.error(
			`Fetch from ${input} responded with an error: ${await response.json()}`,
		)
		return null
	} catch (error: any) {
		console.error(`Error in fetch from ${input}: ${error}`)
		return null
	}
}

export function delay(t: number) {
	return new Promise((resolve) => setTimeout(resolve, t))
}
