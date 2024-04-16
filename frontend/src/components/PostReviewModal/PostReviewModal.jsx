import styles from "./PostReviewModal.module.css"

import { FaStar, FaRegStar } from "react-icons/fa"
import { useState } from "react"

export default function PostReviewModal(){
    const [ review, setReview ] = useState("")
    const [ userRating, setUserRating ] = useState(0)
    const [ userHover, setUserHover ] = useState(0)

    const handleSubmit = () => {
        
    }

    return (
        <div className={styles.modal}>
            <h1 className={styles.header}>How was your stay?</h1>
            <form className={styles.form}>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="7"
                    placeholder="Leave your review here..."
                />
                <div className={styles.star_section}>
                    <div onMouseOver={() => setUserHover(1)} onMouseOut={() => setUserHover(0)}>
                        { userHover >= 1 || userRating >= 1 ?
                            <FaStar className={styles.star} onClick={() => setUserRating(1)}/>
                            : <FaRegStar className={styles.star} onClick={() => setUserRating(1)}/>
                        }
                    </div>
                    <div onMouseOver={() => setUserHover(2)} onMouseOut={() => setUserHover(0)}>
                        { userHover >= 2 || userRating >= 2 ?
                            <FaStar className={styles.star} onClick={() => setUserRating(2)}/>
                            : <FaRegStar className={styles.star} onClick={() => setUserRating(2)}/>
                        }
                    </div>
                    <div onMouseOver={() => setUserHover(3)} onMouseOut={() => setUserHover(0)}>
                        { userHover >= 3 || userRating >= 3 ?
                            <FaStar className={styles.star} onClick={() => setUserRating(3)}/>
                            : <FaRegStar className={styles.star} onClick={() => setUserRating(3)}/>
                        }
                    </div>
                    <div onMouseOver={() => setUserHover(4)} onMouseOut={() => setUserHover(0)}>
                        { userHover >= 4 || userRating >= 4 ?
                            <FaStar className={styles.star} onClick={() => setUserRating(4)}/>
                            : <FaRegStar className={styles.star} onClick={() => setUserRating(4)}/>
                        }
                    </div>
                    <div onMouseOver={() => setUserHover(5)} onMouseOut={() => setUserHover(0)}>
                        { userHover >= 5 || userRating >= 5 ?
                            <FaStar className={styles.star} onClick={() => setUserRating(5)}/>
                            : <FaRegStar className={styles.star} onClick={() => setUserRating(5)}/>
                        }
                    </div>
                    <span className={styles.stars_text}>Stars</span>
                </div>
                <button type="submit" className={styles.button} disabled={review.length < 10 || userRating < 1}>Submit Your Review</button>
            </form>
        </div>
    )
}
