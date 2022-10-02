# Changelog for musicchartmaker.com

## Version Beta-0.7.0

- Feat - Many changes to make the site work better on mobile!
- Dev - Fixed vite failing to serve properly via config changes and module bumping

---

## Version Beta-0.6.1

- Perf - Cache valid fonts
- Fix - Chart adding not being set on creation of new chart.
- Fix - Removed ability to rename a chart to the name of a previously stored chart name
- Dev - break up of shared and storage files to not be so monolithic
- Dev - rewrote GlobalChartState and GlobalSiteOptions to reactive() because the ref() wrap was not necessary since they are objects

---

## Version Beta-0.6.0

- Feat - Chart Text: Font Selectors
- Feat - Chart Text: size and spacing sliders
- Feat - Chart Padding sliders
- Dev - Enhanced fetch() wrapper
- Dev - Condense Tailwind to have more custom classes to K.I.S.S
- Dev - Major refactor of Options component to not be a monolith
