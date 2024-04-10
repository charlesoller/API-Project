import styles from "./SpotCard.module.css"
import { FaStar } from "react-icons/fa";

export default function SpotCard({ spot }){
    const { previewImage, city, state, price, avgRating } = spot
    return (
        <article className={styles.container}>
            <div className={styles.image_container}>
                <img src={ previewImage } alt="Preview Image of a Spot to rent." className={styles.image} />
            </div>
            <div className={styles.info}>
                <div>
                    <p className={styles.location}>{ city }, { state }</p>
                    <p className={styles.price}><b>${ price }</b>/night</p>
                </div>
                <div className={styles.rating}>
                    <FaStar />
                    <p>{ avgRating }</p>
                </div>
            </div>
        </article>
    )
}
