import { useState } from "react"
import styles from "./CreateSpot.module.css"

export default function CreateSpot(){
    const [ country, setCountry ] = useState("")
    const [ address, setAddress ] = useState("")
    const [ city, setCity ] = useState("")
    const [ state, setState ] = useState("")
    const [ lat, setLat ] = useState(0)
    const [ long, setLong ] = useState(0)
    const [ description, setDescription ] = useState("")
    const [ title, setTitle ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ previewImage, setPreviewImage ] = useState("")
    const [ image1, setImage1 ] = useState("")
    const [ image2, setImage2 ] = useState("")
    const [ image3, setImage3 ] = useState("")
    const [ image4, setImage4 ] = useState("")

    return (
        <main>
            <h1 className={styles.title}>Create a new Spot</h1>
            <form>
                <h3 className={styles.subtitle}>Where's your place located?</h3>
                <h6 className={styles.title_description}>Guests will only get your exact address once they have booked a reservation.</h6>
                <label className={styles.input_group}>
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
            </form>

        </main>
    )
}
