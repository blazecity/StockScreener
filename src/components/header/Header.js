import '../../App.css';
import styles from './Header.module.css';
import {Link} from "react-router-dom";

function Header() {
    return (
        <nav>
            <Link to="/">
                <span className={styles.header_logo}>Stock Screener</span>
            </Link>
            <div className={styles.nav_elements}>
                <Link to="/documentation">
                    <span className={styles.nav_element}>Documentation</span>
                </Link>
                <Link to="/concept">
                    <span className={styles.nav_element}>Concept</span>
                </Link>
                <Link to="/about">
                    <span className={styles.nav_element}>About</span>
                </Link>
            </div>
        </nav>
    )   
}

export default Header;
