import { useTranslation } from "react-i18next";
import profileImg from '../assets/profile.webp';

const About = () => {
     const { t } = useTranslation();
    return (
            <section className="about">
                <img
                    src={profileImg}
                    alt="Artist Portrait"
                    className="profile-circle"
                />
                <div className="about-text">
                    <h1>{t("about_title")}</h1>
                    <h2>Sakari De-Meis</h2>
                    <p>{t("about_text")}</p>
                </div>
            </section>
        );
    }

export default About