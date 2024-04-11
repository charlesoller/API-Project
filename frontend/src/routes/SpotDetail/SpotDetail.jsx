import styles from "./SpotDetail.module.css"
import { useLocation } from 'react-router-dom'
import { FaStar } from "react-icons/fa"
import { Review, ReserveSpotCard } from "../../components"

export default function SpotDetail(){
    const location = useLocation()
    const { name, city, state, country, previewImage, ownerId, price, description, avgRating } = location.state
    return (
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
                    <h3 className={styles.host}>Hosted by Firstname Lastname</h3>
                    {/* Need to implement host fetch above */}

                    <p className={styles.description}>{description}</p>
                </div>

                <ReserveSpotCard price={price} avgRating={avgRating} numReviews={3}/>
                {/* Update above with proper review data */}
            </section>

            <section>
                <h3> <FaStar /> { avgRating } | # Reviews</h3>
                {/* Need to implement review counting for above */}
                <Review />
                {/* Review should receive related info for review completion */}
            </section>


        </main>
    )
}
