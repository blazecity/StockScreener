import Loader from "react-loader-spinner";
import styles from "./LoadingSymbol.module.css";

function LoadingSymbol(props) {
    return (
        <Loader className={props.loading ? styles.overlay : styles.no_overlay} type="BallTriangle" color="black" height={50} width={50} />
    );
}

export default LoadingSymbol;