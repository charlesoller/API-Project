import styles from "./ManageSpots.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchCurrentUserSpotsThunk } from "../../store/spot";
import { UserSpotCard } from "../../components";
import { Link } from "react-router-dom";

export default function ManageSpots(){
    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const spots = useSelector(state => Object.values(state.spot))
        .filter(spot => Number(spot.ownerId) === Number(user.id))

    useEffect(() => {
        dispatch(fetchCurrentUserSpotsThunk())
    }, [ dispatch ])

    const spotComponents = spots.map(spot => {
        return (
            <UserSpotCard key={spot.id} spot={spot}/>
        )
    })

    return (
        <main className={styles.main}>
            <h1 className={styles.header}>Manage Your Spots</h1>
            <Link to="/spots/new" className={styles.button}>Create a New Spot</Link>
            <section className={styles.grid}>
                { spotComponents }
            </section>
        </main>
    )
}
