import styles from "./PostReviewModal.module.css"

import { FaStar, FaRegStar } from "react-icons/fa"

export default function PostReviewModal(){
    return (
        <div>
            <h1>How was your stay?</h1>
            <textarea />
            <FaRegStar /> <FaStar />
            <button>Submit Your Review</button>
        </div>
    )
}
