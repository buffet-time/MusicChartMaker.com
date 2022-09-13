// // // // // // // //
// Function wrappers
// // // // // // // //

// This is a wrapper around the Fetch WebAPI to handle errors without any fuss
export async function ProperFetch(url: string): Promise<any | null> {
	try {
		const response = await fetch(url)

		if (response.ok) {
			return await response.json()
		} else {
			console.error('Responded with an error:' + (await response.json()))
			return null
		}
	} catch (error) {
		console.error(`Error in fetch call: ${error}`)
		return null
	}
}
