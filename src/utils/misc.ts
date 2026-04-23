import type {
	AlbumSearchResult,
	JSONReturnType,
	MovieAndTvSearchResult,
	SiteOptions,
} from '#types'
import { top42, top100 } from '#utils/chart'

// These are separate to trivialize knowing whether its a placeholder box or just no image.
const grayBoxFileBase = 'grayBox'
const grayBox2to3 = `${grayBoxFileBase}-200300`
const grayBox1to1 = `${grayBoxFileBase}-300300`
export const GrayBoxImgForPlaceholderForMusic = `${grayBox1to1}.jpg`
export const GrayBoxImgFromApiForMusic = `${grayBox1to1}.jpeg`
export const GrayBoxImgForPlaceholderForMedia = `${grayBox2to3}.jpeg`
export const GrayBoxImgFromApiForMedia = `${grayBox2to3}.jpg`

export const FillerAlbum: AlbumSearchResult = {
	image: GrayBoxImgForPlaceholderForMusic,
	artist: 'Artist',
	name: 'Album',
}

export const FillerMedia: MovieAndTvSearchResult = {
	image: GrayBoxImgForPlaceholderForMusic,
	title: 'TV/ Movie Name',
	year: '2019',
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

export function isMobile() {
	// If anyone else sees this, trust me. Its ok in this case, it isn't a SAAS product being sold <3
	return document.body.clientWidth < 768
}
