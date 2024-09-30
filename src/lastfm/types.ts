interface Album {
	name: string
	artist: string
	url: string
	image: [
		{
			'#text': string
			size: 'small'
		},
		{
			'#text': string
			size: 'medium'
		},
		{
			'#text': string
			size: 'large'
		},
		// use this one image[3]
		{
			'#text': string
			size: 'extralarge'
		},
	]
	streamable: string
	mbid: string
}
interface TopAlbumsArrayImageObject {
	size: string
	'#text': ''
}

interface TopAlbumsArrayObject {
	artist: {
		url: string
		name: string
		mbid: string
	}
	image: TopAlbumsArrayImageObject[]
	mbid: string
	url: string
	playcount: string
	'@attr': { rank: string }
	name: string
}

export interface AlbumReturn {
	image: string
	name: string
	artist: string
}

export interface AlbumResults {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	topalbums: any
	results: {
		'opensearch:Query': {
			'#text': string
			role: string
			searchTerms: string
			startPage: string
		}
		'opensearch:totalResults': string
		'opensearch:startIndex': string
		'opensearch:itemsPerPage': string
		albummatches: {
			album: Album[]
		}
		'@attr': {
			for: string
		}
	}
}

export interface TopAlbumsResult {
	topalbums: {
		album: TopAlbumsArrayObject[]
		'@attr': {
			user: string
			totalPages: string
			page: string
			perPage: string
			total: string
		}
	}
}
