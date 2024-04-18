import styles from "./DeleteReviewModal.module.css"
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/review";

export default function DeleteReviewModal({ id }){
    const { closeModal } = useModal();
    const dispatch = useDispatch()

    const handleDelete = () => {
        dispatch(deleteReviewThunk(id))
        closeModal()
    }

    return (
        <div className={styles.modal}>
            <h1 className={styles.header}>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button className={styles.button} onClick={handleDelete}>Yes (Delete Review)</button>
            <button className={styles.button_no} onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}
