import { ref, type Ref } from 'vue'
import type { ChartState, SiteOptions } from '#types'
import { GetSiteOptions, getStoredChart } from '#utils/storage'
import { GenerateDefaultChart } from '#utils/chart'
import { GenerateDefaultSiteOptions } from '#utils/misc'

// TODO: look into adding Pinia for state management

// pull from storage or generate site options and chartstate
const storedOptions = GetSiteOptions()
const loadOptions = storedOptions ? storedOptions : GenerateDefaultSiteOptions()

const storedChart = getStoredChart(loadOptions.currentChart)
const loadChartState = storedChart ? storedChart : GenerateDefaultChart()

export const GlobalSiteOptions: Ref<SiteOptions> = ref(loadOptions)
export const GlobalChartState: Ref<ChartState> = ref(loadChartState)
export const StoredChartNames = ref([''])
export const selectedChartTitle = ref('')
export const singleChartSelectedChartTitle = ref('')
