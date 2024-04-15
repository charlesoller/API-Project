import { useState } from "react"
import styles from "./CreateSpot.module.css"
import { createSpotThunk } from "../../store/spot"
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function CreateSpot(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ country, setCountry ] = useState("")
    const [ address, setAddress ] = useState("")
    const [ city, setCity ] = useState("")
    const [ state, setState ] = useState("")
    const [ lat, setLat ] = useState(0)
    const [ lng, setLng ] = useState(0)
    const [ description, setDescription ] = useState("")
    const [ name, setName ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ previewImage, setPreviewImage ] = useState("")
    const [ image1, setImage1 ] = useState("")
    const [ image2, setImage2 ] = useState("")
    const [ image3, setImage3 ] = useState("")
    const [ image4, setImage4 ] = useState("")
    const [ errors, setErrors ] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()
        const err = {}
        const imgs = []

        if(!country.length){
            err.country = "Country is required"
        }
        if(!address.length){
            err.address = "Address is required"
        }
        if(!city.length){
            err.city = "City is required"
        }
        if(!state.length){
            err.state = "State is required"
        }
        if(!lat){
            err.lat = "Latitude is required"
        }
        if(!lng){
            err.lng = "Longitude is required"
        }
        if(description.length < 30){
            err.description = "Description needs 30 or more characters"
        }
        if(!name.length){
            err.name = "Name is required"
        }
        if(!price){
            err.price = "Price is required"
        }
        if(!previewImage.length){
            err.previewImage = "Preview Image is required"
        }

        setErrors(err)

        // IF NO ERRORS
        if(!Object.keys(err).length){
            imgs.push({ url: previewImage, preview: true })
            if(image1){
                imgs.push({ url: image1, preview: false })
            }
            if(image2){
                imgs.push({ url: image2, preview: false })
            }
            if(image3){
                imgs.push({ url: image3, preview: false })
            }
            if(image4){
                imgs.push({ url: image4, preview: false })
            }

            const spot = {
                address, city, state, country, lat, lng, name, description, price
            }

            console.log("Successfully submitted form!")
            dispatch(createSpotThunk(spot, imgs, navigate))
        }
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Create a new Spot</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Where&apos;s your place located?</h3>
                    <h6 className={styles.title_description}>Guests will only get your exact address once they have booked a reservation.</h6>
                    <label className={styles.input_group}>
                        <div className={styles.side_by_side}>
                            Country
                            {errors.country && <p className={styles.error}>{errors.country}</p>}
                        </div>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            className={styles.input}
                        />
                    </label>
                    <label className={styles.input_group}>
                        <div className={styles.side_by_side}>
                            Street Address
                            {errors.address && <p className={styles.error}>{errors.address}</p>}
                        </div>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                            className={styles.input}
                        />
                    </label>
                    <div className={styles.side_by_side}>
                        <label className={styles.input_group}>
                            <div className={styles.side_by_side}>
                                City
                                {errors.city && <p className={styles.error}>{errors.city}</p>}
                            </div>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.input_group}>
                            <div className={styles.side_by_side}>
                                State
                                {errors.state && <p className={styles.error}>{errors.state}</p>}
                            </div>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div className={styles.side_by_side}>
                        <label className={styles.input_group}>
                            <div className={styles.side_by_side}>
                                Latitude
                                {errors.lat && <p className={styles.error}>{errors.lat}</p>}
                            </div>
                            <input
                                type="text"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="Latitude"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.input_group}>
                            <div className={styles.side_by_side}>
                                Longitude
                                {errors.lng && <p className={styles.error}>{errors.lng}</p>}
                            </div>
                            <input
                                type="text"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="Longitude"
                                className={styles.input}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Describe your place to guests</h3>
                    <h6 className={styles.title_description}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h6>
                    <label className={styles.input_group}>
                            Description
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                placeholder="Please write at least 30 characters"
                            />
                            { errors.description && <p className={styles.error}>{errors.description}</p> }
                    </label>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Create a title for your spot</h3>
                    <h6 className={styles.title_description}>Catch guests&apos; attention with a spot title that highlights was makes your place special.</h6>
                    <label className={styles.input_group}>
                        Name of your spot
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                            className={styles.input}
                        />
                        { errors.name && <p className={styles.error}>{errors.name}</p> }
                    </label>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Set a base price for your spot</h3>
                    <h6 className={styles.title_description}>Competitive pricing can help your listing stand out and rank higher in search results.</h6>
                    <label className={styles.input_group}>
                        Price per night (USD)
                        <div className={styles.price_input}>
                        $ <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night (USD)"
                            className={styles.input}
                        />
                        </div>
                        { errors.price && <p className={styles.error}>{errors.price}</p> }
                    </label>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>Liven up your spot with photos</h3>
                    <h6 className={styles.title_description}>Submit a link to at least one photo to publish your spot.</h6>
                    <label className={styles.input_group}>
                        Preview Image URL
                        <input
                            type="text"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            placeholder="Preview Image URL"
                            className={styles.input}
                        />
                        { errors.previewImage && <p className={styles.error}>{errors.previewImage}</p> }
                    </label>
                    <label className={styles.input_group}>
                        Image URL
                        <input
                            type="text"
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                            placeholder="Image URL"
                            className={styles.input}
                        />
                        { errors.image1 && <p className={styles.error}>{errors.image1}</p> }
                    </label>
                    <label className={styles.input_group}>
                        Image URL
                        <input
                            type="text"
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                            placeholder="Image URL"
                            className={styles.input}
                        />
                        { errors.image2 && <p className={styles.error}>{errors.image2}</p> }
                    </label>
                    <label className={styles.input_group}>
                        Image URL
                        <input
                            type="text"
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                            placeholder="Image URL"
                            className={styles.input}
                        />
                        { errors.image3 && <p className={styles.error}>{errors.image3}</p> }
                    </label>
                    <label className={styles.input_group}>
                        Image URL
                        <input
                            type="text"
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                            placeholder="Image URL"
                            className={styles.input}
                        />
                        { errors.image4 && <p className={styles.error}>{errors.image4}</p> }
                    </label>
                </div>

                <button type="submit" className={styles.button}>Create Spot</button>
            </form>

        </main>
    )
}
