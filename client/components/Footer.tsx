import styles from "../styles/Footer.module.css";
import Image from "next/image"

export default function Footer() {
    return (
        <div id="footer" className={styles.container}>
            <div className={styles.item}>
                <Image src="/img/bg.jpg" alt="" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.item}>
                <div className={styles.card}>
                    <h2 className={styles.motto}>
                        Oh Yes, We Did! Hot and spicy&apos;s pizza, Well Baked Slice of Pizza.
                    </h2>
                </div>
                <div className={styles.card}>
                    <h1 className={styles.title}>Find Our Restaurants</h1>
                    <p className={styles.text}>1654 R. Marine Drive Avenue #304.<br/>Mumbai, Maharashtra, 400020<br/>(022) 867-1010</p>
                    <p className={styles.text}>2567 R. FC Road Avenue #235.<br/>Pune, Maharashtra, 411004<br/>(020) 867-1011</p>
                    <p className={styles.text}>3701 R. Station Road Street #104.<br/>Kolhapur, Maharashtra, 416001<br/>(0231) 867-1014</p>
                </div>
                <div className={styles.card}>
                    <h1 className={styles.title}>Working Hours</h1>
                    <p className={styles.text}>Sunday - Friday<br/>9:00 AM - 9:00 PM</p>
                </div>
            </div> 
        </div>
    );
}
