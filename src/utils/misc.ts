import type {
	AlbumSearchResult,
	JSONReturnType,
	MovieAndTvSearchResult,
	SiteOptions,
} from '#types'
import { top42, top100 } from '#utils/chart'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

// These are separate to trivialize knowing whether its a placeholder box or just no image.
const grayBoxFileBase = 'grayBox'
const grayBox2to3 = `${grayBoxFileBase}-200300`
const grayBox1to1 = `${grayBoxFileBase}-300300`
export const LegacyPlaceholder = 'grayBox.jpg'
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

export async function IsImage(url: string): Promise<boolean> {
	return new Promise((resolve) => {
		const image = new Image()
		// oxlint-disable-next-line unicorn/prefer-add-event-listener
		image.onerror = image.onabort = () => resolve(false)
		// oxlint-disable-next-line unicorn/prefer-add-event-listener
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

export const isMobile = ref<boolean>()

const debouncedIsMobile = useDebounceFn(() => {
	isMobile.value = document.body.clientWidth < 768
}, 50)

window.addEventListener('resize', debouncedIsMobile)
