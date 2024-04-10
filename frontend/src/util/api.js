import { csrfFetch } from "../store/csrf"

export const getAllSpots = async() => {
    try {
        const res = await csrfFetch('/api/spots').then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}

// export const getImagesBySpotId = async(id) => {

// }
