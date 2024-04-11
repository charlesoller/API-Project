import { csrfFetch } from "../store/csrf"

// ======================== Spot Routes ========================

export const getAllSpots = async() => {
    try {
        const res = await csrfFetch('/api/spots').then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}

export const getSpotDetailsById = async(id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}`).then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}

// ======================== Review Routes ========================

export const getReviewsBySpotId = async(id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}/reviews`).then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}
