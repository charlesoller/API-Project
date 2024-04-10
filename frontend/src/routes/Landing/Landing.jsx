import styles from "./Landing.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotsThunk } from "../../store/spot";
import { useEffect, useState } from "react";
import { SpotCard } from "../../components";

export default function Landing(){
    const dispatch = useDispatch()

    const spots = useSelector(state => Object.values(state.spot)); // populate from Redux store
    console.log(spots)

    useEffect(() => {
      dispatch(fetchSpotsThunk())
    }, [ dispatch ])

    const spotComponents = spots.map(spot => {
        return (
            <SpotCard key={spot.id} spot={spot}/>
        )
    })

    return (
        <main className={styles.grid}>
            { spotComponents }
        </main>
    )
}
