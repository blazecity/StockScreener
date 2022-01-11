import styles from "./About.module.css";
import AboutDescription from "./AboutDescription";

let imageJan = require("./img/img_jan.jpg");
let imageChris = require("./img/img_chris.jpg");

function About() {
    const descriptionJan = "Jan does his Bachelor in Business IT with major in data science and data engineering. " +
        "He will finish at the beginning of 2023. " +
        "He studies part-time and works for Luzerner Kantonalbank as part of the Trading Services team."

    const descriptionChris = "Chris does his full-time Bachelor in Business IT with major data science and data engineering. " +
        "He will finish in Summer 2022."

    return (
        <div className="general_container">
            <h1 className="general_title">About us</h1>
            <div className={styles.about_section}>
                <AboutDescription name="Jan Baumann" img={imageJan.default} description={descriptionJan} contact="jan.baumann@stud.hslu.ch"></AboutDescription>
                <AboutDescription name="Chris Imholz" img={imageChris.default} description={descriptionChris} contact="chris.imholz@stud.hslu.ch"></AboutDescription>
            </div>
        </div>
    );
}

export default About;
