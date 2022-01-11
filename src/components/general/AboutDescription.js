import styles from "./AboutDescription.module.css"

function AboutDescription(props) {
    return (
        <div className={styles.desc}>
            <img className={styles.desc_images} src={props.img} alt={props.name} />
            <span className={styles.name}>{props.name}</span>
            <a href={`mailto:${props.contact}`}>
                <span className={styles.email}>{props.contact}</span>
            </a>
            <span className={styles.desc_text}>{props.description}</span>
        </div>
    )
}

export default AboutDescription;
