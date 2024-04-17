import styles from "./UserSpotCard.module.css"
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"

export default function UserSpotCard({ spot }){
    const { previewImage, city, state, price, avgRating, id } = spot
    return (
        <Link to={`/spots/${id}`} state={ spot }>
            <article className={styles.container}>
                <div className={styles.image_container}>
                    <img src={ previewImage } alt="Preview Image of a Spot to rent." className={styles.image} />
                </div>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <div>
                            <p className={styles.location}>{ city }, { state }</p>
                            <p className={styles.price}><b>${ price.toFixed(2) }</b>/night</p>
                        </div>
                        <div className={styles.rating}>
                            <FaStar />
                            <p>{ avgRating ? avgRating : "New" }</p>
                        </div>
                    </div>
                    <div className={styles.user_options}>
                        <Link to={`/spots/${id}/edit`} state={spot} className={styles.button}>
                            Update
                        </Link>
                        <button className={styles.button}>Delete</button>
                    </div>
                </div>

            </article>
        </Link>
    )
}