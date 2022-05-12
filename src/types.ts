export interface AlbumSearchResult {
	image: string
	name: string
	artist: string
}

export interface ChartTileBase {
	image: string
	name: string
}

export interface AlbumTile extends ChartTileBase {
	artist: string
	timesPlayed?: string
}
