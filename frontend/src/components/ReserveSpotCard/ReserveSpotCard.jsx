import styles from "./ReserveSpotCard.module.css"
import { FaStar } from "react-icons/fa"

export default function ReserveSpotCard({ price, avgRating, numReviews }){
    return (
        <aside className={styles.card}>
            <div className={styles.info}>
                <h3 className={styles.price_info}><span className={styles.price}>${ price.toFixed(2) }</span> /night</h3>

                <div className={styles.review_info}>
                    <h3> <FaStar /> <span className={styles.rating}>{ avgRating }</span> • { numReviews } Reviews</h3>
                </div>
            </div>
            <button className={styles.button} onClick={() => alert("Feature coming soon")}>Reserve</button>
        </aside>
    )
}
