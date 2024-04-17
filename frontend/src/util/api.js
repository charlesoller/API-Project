import { csrfFetch } from "../store/csrf"

// ======================== Spot Routes ========================

export const getAllSpots = async() => {
    try {
        const res = await csrfFetch('/api/spots').then(res => res.json())
        console.log(res)
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}

export const getSpotDetailsById = async(id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}`)
            .then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to fetch.")
    }
}

export const getCurrentUserSpots = async() => {
    try {
        const res = await csrfFetch('/api/spots/current')
            .then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to current user's spots fetch.")
    }
}

export const createSpot = async(spot) => {
    // console.log("IN API FUNCTION")
    // console.log("THE SUBMITTED SPOT: ", spot)
    try {
        const res = await csrfFetch("/api/spots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(spot)
        }).then(res => res.json())
        return res
    } catch(e) {
        // DEBUG LINE BELOW
        // console.log(e)
        throw new Error("Unable to create spot.")
    }
}

export const createImageBasedOnSpotId = async(img, id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}/images`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(img)
        }).then(res => res.json())
        return res
    } catch(e) {
        throw new Error("Unable to create spot.")
    }
}

// ======================== Review Routes ========================

export const getReviewsBySpotId = async(id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}/reviews`).then(res => res.json())
        return res
    } catch (e) {
        throw new Error(e.message)
    }
}

export const createReviewBasedOnSpotId = async(review, id) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        }).then(res => res.json())
        return res
    } catch (e) {
        throw new Error("Unable to create review.")
    }
}
