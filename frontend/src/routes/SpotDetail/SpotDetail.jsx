import styles from "./SpotDetail.module.css"
import { useLocation, useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa"
import { Review, ReserveSpotCard, OpenModalButton, PostReviewModal } from "../../components"
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsThunk } from "../../store/spot";
import { fetchReviewsBySpotIdThunk } from "../../store/review";
import { useEffect, useState } from "react";
import { capitalize } from "../../util/helper";

export default function SpotDetail(){
    const dispatch = useDispatch()
    const location = useLocation()

    const { name, city, state, country, price, description, avgRating, id, previewImage } = location.state
    const spot = useSelector(state => state.spot[id])
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => Object.values(state.review)).filter(review => review.spotId === id)

    const reviewElements = reviews.map(review => {
        return <Review review={review} />
    })

    const hasNotReviewed = () => {
        return reviews.every(review => review.userId !== user.id)
    }

    useEffect(() => {
        dispatch(fetchSpotDetailsThunk(id))
        try {
            dispatch(fetchReviewsBySpotIdThunk(id))
        } catch (e) {
            console.log("HERE")
            console.log(e.message)
        }
    }, [ dispatch ])

    return (
        spot?.Owner && spot.SpotImages ? // This line of code is sloppy. I think that really, spot should be held in state and updated after the running of the useEffect.
        (
            <main className={styles.container}>
                <section className={styles.title_info}>
                    <h1>{ name }</h1>
                    <h4>{ city }, { state }, { country }</h4>
                </section>

                <section className={styles.image_layout}>
                    <div>
                        <img className={styles.main_image} src={previewImage} alt="An image of a spot available for rental"/>
                    </div>

                    <div className={styles.image_grid}>
                        <div className={styles.test}>
                            <img className={styles.grid_image} src={previewImage}/>
                        </div>
                        <img className={styles.grid_image} src={previewImage}/>
                        <img className={styles.grid_image} src={previewImage}/>
                        <img className={styles.grid_image} src={previewImage}/>
                    </div>
                </section>

                <section className={styles.spot_info}>
                    <div className={styles.info}>
                        <h3 className={styles.host}>Hosted by {capitalize(spot.Owner.firstName)} {capitalize(spot.Owner.lastName)}</h3>

                        <p className={styles.description}>{description}</p>
                    </div>

                    <ReserveSpotCard price={price} avgRating={avgRating} numReviews={spot.numReviews}/>
                </section>

                <section>
                    <h3 className={styles.review_header}> <FaStar /> { avgRating } • { spot.numReviews ? spot.numReviews + " Reviews": "New" }</h3>
                    {user && spot.Owner.id !== user.id && hasNotReviewed() && <OpenModalButton className={styles.post_review_button} modalComponent={<PostReviewModal />} buttonText="Post Your Review" />}
                    <div className={styles.review_elements}>
                        { reviewElements }
                    </div>
                </section>
            </main>
        )
        : (
            <h1>Loading</h1>
        )
    )
}
