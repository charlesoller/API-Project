import styles from "./Review.module.css"
import { formatDate } from "../../util/helper"

export default function Review({ review }){
    // console.log(review)
    const { review: reviewText, createdAt } = review
    const { firstName } = review.User
    return (
        <article className={styles.card}>
            <h5 className={styles.name}>{firstName}</h5>
            <p className={styles.date}>{formatDate(createdAt)}</p>
            <p className={styles.review}>{reviewText}</p>
        </article>
    )
}
