import { type ChartState } from './types'

export function getStoredChart(key: string): ChartState | undefined {
	const item = localStorage.getItem(key)
	console.log(`getStoredChart => retrieved ${item} from storage`)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

export function setStoredChart(input: string, value: ChartState): void {
	localStorage.setItem(input, JSON.stringify(value))
	console.log(
		`setStoredChart => Under name ${input}, stored chart state ${value}`
	)
}

export function deleteStoredChart(input: string): void {
	localStorage.removeItem(input)
	console.log(`removed chart labeled ${input}`)
}
