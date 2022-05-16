export interface AlbumSearchResult {
	image: string
	name: string
	artist: string
}

export interface AlbumTile extends AlbumSearchResult {
	timesPlayed?: string
}

export interface ChartOptions {
	chartSize: {
		length: number
		width: number
	}
	chartTitle: string
	displayTitles: boolean
	displayNumberRank: boolean
	displayPlaycount: boolean
	background?: string
	font?: string
	padding?: string
}

export enum ChartSizeOptions {
	COLLAGE = 0,
	TOP_40 = 1,
	TOP_42 = 2,
	TOP_100 = 3
}

export interface ChartState {
	options: ChartOptions
	chartTiles: AlbumTile[]
}
