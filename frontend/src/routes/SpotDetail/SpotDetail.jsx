import styles from "./SpotDetail.module.css"
import { useLocation } from 'react-router-dom'
import { FaStar } from "react-icons/fa"
import { Review, ReserveSpotCard } from "../../components"
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsThunk } from "../../store/spot";
import { useEffect, useState } from "react";
import { capitalize } from "../../util/helper";

export default function SpotDetail(){
    const dispatch = useDispatch()
    const location = useLocation()
    const { name, city, state, country, previewImage, ownerId, price, description, avgRating, id } = location.state

    const spot = useSelector(state => state.spot[id])

    // const { firstName: ownerFirst, lastName: ownerLast } = spot.Owner
    // const { numReviews } = spot
    console.log(spot)
    useEffect(() => {
        dispatch(fetchSpotDetailsThunk(id))
    }, [ dispatch ])

    return (
        spot?.Owner && spot.numReviews ?
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
                    <h3> <FaStar /> { avgRating } • { spot.numReviews } Reviews</h3>
                    {/* This still needs the review data */}
                    <Review name={spot.Owner.firstName} />
                </section>
            </main>
        )
        : (
            <h1>Loading</h1>
        )
    )
}
