import * as React from "react";
import { db } from "../configs/firebase";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Icons = () => {
    const [techs, setTechs] = React.useState([]);

    React.useEffect(() => {
        if (!db) {
            console.error("Firebase db not initialized");
            return;
        }
        
        const q = query(collection(db, "icons"), orderBy("sort_order", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const techArray = [];
                querySnapshot.forEach((doc) => {
                    techArray.push({ id: doc.id, ...doc.data() });
                });
                setTechs(techArray);
            },
            (error) => {
                console.error("Error fetching icons:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <>
            {techs.map((tech) => (
                <div 
                    key={tech.id}
                    className={`tech-icon-float ${tech.label}`}
                >
                    <i className={`fa-brands ${tech.iconClass}`}></i>
                </div>
            ))}
        </>
    );
};

export default Icons;