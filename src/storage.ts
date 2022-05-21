import { type ChartState } from './types'

// // // //
// Other
// // // //
export function getAllSavedKeys(): string[] {
	return Object.keys(localStorage).filter(
		(current) => current !== 'CurrentChart'
	)
}

// // // // // // // // //
// Handling Current Chart
// // // // // // // // //
export function getCurrentChart(): string | null {
	return localStorage.getItem('CurrentChart')
}

export function setCurrentChart(chartTitle: string): void {
	// TODO: handle errors
	localStorage.setItem('CurrentChart', chartTitle)
}

// // // // // // // // //
// Handling ChartStates
// // // // // // // // //
export function getStoredChart(key: string): ChartState | undefined {
	const item = localStorage.getItem(key)
	// console.log(`getStoredChart => retrieved ${item} from storage`)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

export function setStoredChart(key: string, value: ChartState): void {
	// TODO: handle errors
	localStorage.setItem(key, JSON.stringify(value))
	// console.log(
	// 	`setStoredChart => Under name ${input}, stored chart state ${value}`
	// )
}

export function deleteStoredChart(key: string): void {
	localStorage.removeItem(key)
	// console.log(`removed chart labeled ${input}`)
}
