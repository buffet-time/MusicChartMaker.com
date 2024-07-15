import type { AlbumResults, AlbumReturn, TopAlbumsResult } from '#lastfm/types'
import { GrayBoxImgFromApi, ProperFetch } from '#shared/misc'

type LastfmPeriod =
	| 'overall'
	| '7day'
	| '1month'
	| '3month'
	| '6month'
	| '12month'

// For some reason Last.fm for authorization puts this out anyways so it's ok to be public?
const lastFmApiKey = '5305bfeacfbbb03eafa3372a536d0ec8'

const apiBaseUrl = 'https://ws.audioscrobbler.com/2.0/'

const searchBaseUrl = `${apiBaseUrl}?method=album.search&album=`
const topAlbumBaseUrl = `${apiBaseUrl}?method=user.gettopalbums&user=`
//  /2.0/?method=user.gettopalbums&user=rj&api_key=YOUR_API_KEY&format=json

const searchRequestMax = 50
const searchRequestMinimum = 1
const topAlbumRequestMax = 100
const topAlbumRequestMinimum = 1

export async function searchAlbum(limit: number, album: string) {
	try {
		let requestLimit = searchRequestMinimum

		// limit max to 50 and ensure its at least 10
		if (limit && limit <= searchRequestMax && limit >= searchRequestMinimum) {
			requestLimit = limit
		}

		const apiUrl = `${searchBaseUrl}${album}&api_key=${lastFmApiKey}&limit=${requestLimit}&format=json`

		const results: AlbumResults = (await ProperFetch(
			apiUrl
		)) as unknown as AlbumResults

		return results.results.albummatches.album.map((album) => {
			return {
				image: album.image[3]['#text']
					? album.image[3]['#text']
					: GrayBoxImgFromApi,
				artist: album.artist ? album.artist : 'Placeholder Artist',
				name: album.name ? album.name : 'Placeholder Album'
			}
		})
	} catch (error: any) {
		console.log(`Error in /Search request:\n ${error}`)
	}
}

export async function getTopAlbums(
	period: LastfmPeriod,
	limit: number,
	user: string
) {
	try {
		let requestLimit = topAlbumRequestMinimum

		// limit max to 100 and ensure its at least 1
		if (
			limit &&
			limit <= topAlbumRequestMax &&
			limit >= topAlbumRequestMinimum
		) {
			requestLimit = limit
		}

		const requestPeriod = period ? period : '1month'
		const apiUrl = `${topAlbumBaseUrl}${user}&api_key=${lastFmApiKey}&period=${requestPeriod}&limit=${requestLimit}&format=json`

		const results: TopAlbumsResult = (await ProperFetch(
			apiUrl
		)) as unknown as TopAlbumsResult

		return results.topalbums.album.map((album) => {
			return {
				image: album.image[album.image.length - 1]['#text']
					? album.image[album.image.length - 1]['#text']
					: GrayBoxImgFromApi,
				name: album.name,
				artist: album.artist.name
			} as AlbumReturn
		})
	} catch (error: any) {
		console.log(`Error in /Search request:\n ${error}`)
	}
}
