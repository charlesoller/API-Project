import styles from "./Review.module.css"
import { formatDate } from "../../util/helper"
import OpenModalButton from "../OpenModalButton"
import { useSelector } from "react-redux"
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal"

export default function Review({ review }){
    const { review: reviewText, createdAt } = review

    const user = useSelector(state => state.session.user)

    return (
        <article className={styles.card}>
            <h5 className={styles.name}>{review.User?.firstName}</h5>
            <p className={styles.date}>{formatDate(createdAt)}</p>
            <p className={styles.review}>{reviewText}</p>
            {
                review.User?.id === user?.id && <OpenModalButton buttonText="Delete" className={styles.button} modalComponent={<DeleteReviewModal id={review.id} />}/>
            }
        </article>
    )
}
