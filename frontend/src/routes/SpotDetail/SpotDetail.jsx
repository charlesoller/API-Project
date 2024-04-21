import styles from "./SpotDetail.module.css"
import { useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa"
import { Review, ReserveSpotCard, OpenModalButton, PostReviewModal } from "../../components"
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsThunk } from "../../store/spot";
import { fetchReviewsBySpotIdThunk } from "../../store/review";
import { useEffect } from "react";
import { capitalize } from "../../util/helper";

export default function SpotDetail(){
    const dispatch = useDispatch()
    const { id } = useParams()

    // const { name, city, state, country, price, description, avgRating, id, previewImage } = location.state
    const spot = useSelector(state => state.spot[id])
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => Object.values(state.review))
        .filter(review => Number(review.spotId) === Number(id)).reverse()
    const previewImage = spot?.SpotImages?.filter(image => image.preview === true)[0].url
    const reviewElements = reviews.map(review => {
        return <Review key={review.id} review={review} />
    })

    const hasNotReviewed = () => {
        return reviews.every(review => review.userId !== user.id)
    }

    const findAvgReviewRating = (reviews) => {
        console.log(reviews)
        let sum = 0;
        reviews.forEach(review => sum += review.stars)
        const avg = sum / reviews.length

        return avg.toFixed(2)
    }

    useEffect(() => {
        dispatch(fetchSpotDetailsThunk(id))
        try {
            dispatch(fetchReviewsBySpotIdThunk(id))
        } catch (e) {
            // console.log("HERE")
            // console.log(e.message)
        }
    }, [ dispatch, id ])

    return (
        spot?.Owner && spot.SpotImages ? // This line of code is sloppy. I think that really, spot should be held in state and updated after the running of the useEffect.
        (
            <main className={styles.container}>
                <section className={styles.title_info}>
                    <h1>{ spot.name }</h1>
                    <h4>{ spot.city }, { spot.state }, { spot.country }</h4>
                </section>

                <section className={styles.image_layout}>
                    <div>
                        <img className={styles.main_image} src={previewImage} alt="An image of a spot available for rental"/>
                    </div>

                    <div className={styles.image_grid}>
                        <img className={styles.grid_image} src={previewImage}/>
                        <img className={styles.grid_image} src={previewImage}/>
                        <img className={styles.grid_image} src={previewImage}/>
                        <img className={styles.grid_image} src={previewImage}/>
                    </div>
                </section>

                <section className={styles.spot_info}>
                    <div className={styles.info}>
                        <h3 className={styles.host}>Hosted by {capitalize(spot.Owner.firstName)} {capitalize(spot.Owner.lastName)}</h3>

                        <p className={styles.description}>{spot.description}</p>
                    </div>

                    <ReserveSpotCard price={spot.price} avgRating={reviews.length ? findAvgReviewRating(reviews) : undefined} numReviews={reviews.length}/>
                </section>

                <section>
                    <h3 className={styles.review_header}> <FaStar /> { reviews.length ? findAvgReviewRating(reviews) + " • " + reviews.length + ( reviews.length === 1 ? " Review" : " Reviews" ) : "New" }</h3>
                    {user && spot.Owner.id !== user.id && hasNotReviewed() && <OpenModalButton className={styles.post_review_button} modalComponent={<PostReviewModal id={id} />} buttonText="Post Your Review" />}
                    <div className={styles.review_elements}>
                        { reviewElements.length ?
                            reviewElements
                            : user && spot.Owner.id !== user.id && <h4 className={styles.be_first}>Be the first to post a review!</h4>
                        }
                    </div>
                </section>
            </main>
        )
        : (
            <h1>Loading</h1>
        )
    )
}
