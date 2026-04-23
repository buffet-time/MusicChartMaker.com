import type { MovieAndTvSearchResult } from '../types/types'
import { GlobalSiteOptions } from '../utils/globals'
import { ProperFetch } from '../utils/misc'
import type { SearchMovieReturnType, SearchTVReturnType } from './types'

interface MovieAndTvSearch {
	term: string
	year?: number
}

const API_BASE_URL = 'https://api.musicChartMaker.com'
const MOVIE_SUB_DIR = '/Search/Movie'
const TV_SUB_DIR = '/Search/TV'

const MOVIE_URL = API_BASE_URL + MOVIE_SUB_DIR
const TV_URL = API_BASE_URL + TV_SUB_DIR

export async function searchMovie({
	term,
	year,
}: MovieAndTvSearch): Promise<MovieAndTvSearchResult[]> {
	let requestUrl = MOVIE_URL + `?term=${term}`

	// TODO: seems like this is not working!
	requestUrl += GlobalSiteOptions.value.allowAdultSearch
		? '&adult=true'
		: '&adult=false'

	if (year) {
		requestUrl += `&year=${year}`
	}

	const returnResults = (await ProperFetch(
		requestUrl,
	)) as unknown as SearchMovieReturnType[]

	return returnResults.map((result) => {
		return {
			image: result.moviePosterUrl ?? '',
			title: result.title,
			year: result.year?.toString() ?? '',
		}
	})
}

export async function searchTV({
	term,
	year,
}: MovieAndTvSearch): Promise<MovieAndTvSearchResult[]> {
	let requestUrl = TV_URL + `?term=${term}`

	// TODO: seems like this is not working!
	requestUrl += GlobalSiteOptions.value.allowAdultSearch
		? '&adult=true'
		: '&adult=false'

	if (year) {
		requestUrl += `&year=${year}`
	}

	const returnResults = (await ProperFetch(
		requestUrl,
	)) as unknown as SearchTVReturnType[]

	return returnResults.map((result) => {
		return {
			image: result.tvPosterUrl ?? '',
			title: result.title,
			year: result.year?.toString() ?? '',
		}
	})
}
