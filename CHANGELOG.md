# Changelog for musicchartmaker.com

## Version Beta-0.9.3

- Dev - a lot of CSS and other cchanges
- Feat - Adding a lock chart option

## Version Beta-0.9.2

- Fix - various small css changes & fixes
- Dev - Many package updates and changes
- Optimization - Moved assets to static public folder

## Version Beta-0.9.1

- Fix - delete not always working properly for some reason?
- Fix - Search results coming back with gray image but not overlaying the name on top
- CSS - Fixed overflow on text overlay of image sometimes overflowing

## Version Beta-0.9.0

- Feat - Last.FM import functionality!

## Version Beta-0.8.1

- Fix - Changed touch and hold to be doubletap so it works properly.
- Dev - Refactor of `New.vue`to make it easier to maintain

## Version Beta-0.8.0

- Feat - Added Custom Presets!
- Feat - Custom presets can be created, edited, and deleted
- UI - many small changes and added back buttons to replace close buttons
- Fix - A few small accessiblity changes.

## Version Beta-0.7.7

- Bug - Fixed blur appearing when no results are shown
- Feat - Changed how scroll is indicated to user on mobile devices/ small screens

## Version Beta-0.7.6

- Bug - Fixed Save Image button capturing too much of the screen.
- Feat - Added blur to search results to indicate that it's scrollable without sacrificing width by having a scrollbar

## Version Beta-0.7.5

- Feat - Greatly enhanced tooltips w/ a new Tooltip component
- Feat - Yet more small css and other changes for better UI/UX
- Perf - Created more conditionals to reduce listeners and etc on the placeholder boxes

---

## Version Beta-0.7.4

- Feat - Added hold to delete for touch devices
- Feat - various other small changes to CSS for touch
- Feat - finally disabled drag of the placeholder squares
- Feat - added swap if the drop target is the placeholder image
- Feat - lots of other small things to make charts be easier to work with on touch and desktop

---

## Version Beta-0.7.3

- Feat - Even more changes to make the site be more responsive on mobile

---

## Version Beta-0.7.2

- Feat - Even more changes to make the site be more responsive on mobile
- Dev - reverted postcss and tailwind configs to be `.cjs` as they still dont support ESM...

---

## Version Beta-0.7.1

- Feat - Title's are now hidden by default for better mobile support and I see it far less, of course you can always still enable it per chart
- Feat - More changes to make the site work better on mobile!

---

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
