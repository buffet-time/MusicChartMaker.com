import type { AlbumResults, AlbumReturn, TopAlbumsResult } from '#lastfm/types'
import { ProperFetch } from '#shared/misc'

type LastfmPeriod =
	| 'overall'
	| '7day'
	| '1month'
	| '3month'
	| '6month'
	| '12month'

// For some reason Last.fm for authorization puts this out anyways so it's ok to be public?
const lastFmApiKey = '97e07667d61af5f08e860561fb7a2ec8'

const apiBaseUrl = 'https://ws.audioscrobbler.com/2.0/'
const grayImageUrl = 'https://i.imgur.com/5IYcmZz.jpeg'

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

		console.log(12, apiUrl)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const results: AlbumResults = (await ProperFetch(
			apiUrl
		)) as unknown as AlbumResults

		const massagedResponse: AlbumReturn[] = []

		results.results.albummatches.album.forEach((album) => {
			massagedResponse.push({
				image: album.image[3]['#text'] ? album.image[3]['#text'] : grayImageUrl,
				artist: album.artist ? album.artist : 'Placeholder Artist',
				name: album.name ? album.name : 'Placeholder Album'
			})
		})

		return massagedResponse
	} catch (error: any) {
		console.log(`Error in /Search request:\n ${error}`)
	}
}

// TODO: clean this up!
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

		const results: TopAlbumsResult = (await ProperFetch(
			apiUrl
		)) as unknown as TopAlbumsResult

		const values = (await Promise.all(
			results.topalbums.album.map((album) => searchAlbum(1, album.artist.name))
		)) as unknown as AlbumReturn[][]

		return values.map((album) => album[0])
	} catch (error: any) {
		console.log(`Error in /Search request:\n ${error}`)
	}
}
