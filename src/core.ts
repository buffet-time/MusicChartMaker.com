// This is a wrapper around the Fetch() WebAPI to handle errors without any fuss
export async function ProperFetch(
	input: RequestInfo | URL,
	init?: RequestInit | undefined
): Promise<any | null> {
	try {
		const response = await fetch(input, init)

		if (response.ok) {
			return await response.json()
		} else {
			console.error(
				`Fetch from ${input} responded with an error: ${await response.json()}`
			)
			return null
		}
	} catch (error) {
		console.error(`Error in fetch from ${input}: ${error}`)
		return null
	}
}
