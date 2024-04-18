import styles from "./DeleteSpotModal.module.css"
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spot";

export default function DeleteSpotModal({ id }){
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const handleDelete = () => {
        dispatch(deleteSpotThunk(id))
        closeModal()
    }

    return (
        <div className={styles.modal}>
            <h1 className={styles.header}>Confirm Delete</h1>
            <p>Are you sure that you want to remove this spot from the listings?</p>
            <button className={styles.button} onClick={handleDelete}>Yes (Delete Spot)</button>
            <button className={styles.button_no} onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}
