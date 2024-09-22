import { useState } from 'react';
import app from '../firebaseconfig';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import '../style/CreateAuthor.css'
import NavBar from './NavBar';

type Author = {
  name: string;
  age: number;
  country: string;
  pictureUrl: string;
  activeStatus: boolean;
};

export default function CreateAuthor() {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [age, setAge] = useState(20);
    const initActiveStatus = true;

    const saveData = async () => {
        if (!name || !country || !age) {
            alert("Please fill in all fields (name, country, age).");
            return;
        }

        if (age < 20 || age > 120) {
            alert("Age must be between 20 and 120.");
            return;
        }

        const db = getDatabase(app);
        const dbRef = ref(db, "IMDBooks/Authors/");
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
            const authors = snapshot.val() as Author[];
            const duplicateAuthor = Object.values(authors).some(
                (author) => author.name === name
            );

            if (duplicateAuthor) {
                alert("An author with this name already exists.");
                return;
            }
        }

        const newDocRef = push(ref(db, "IMDBooks/Authors"));
        set(newDocRef, {
            name: name,
            age: age,
            country: country,
            pictureUrl: pictureUrl,
            activeStatus: initActiveStatus
        })
        .then(() => {
            console.log("Saved author");
            setName("");
            setCountry("");
            setPictureUrl("");
            setAge(20);
        })
        .catch((err) => {
            console.log("Error is: ", err);
        });
    };

    return (
        <>
        <h1>Create Author Page</h1>
        <NavBar/>
        <div className="create-author-container">
            <input
                type="text"
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder='Country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
            <input
                type="text"
                placeholder='Picture'
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
            />
            <input
                type="number"
                placeholder='Age'
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
            />
            <button onClick={saveData}>Send Data</button>
        </div>
        </>
    );
    
    
}
