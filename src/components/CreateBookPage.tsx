import React, { useState, useEffect } from 'react';
import app from '../firebaseconfig';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import '../style/CreateBookPage.css'
import NavBar from './NavBar';

type Author = {
    name: string;
};

export default function CreateBookPage() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(10);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [authorsArray, setAuthorsArray] = useState<Author[]>([]);
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(true);
    const activeStatus = true;

    const saveData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "IMDBooks/Books/");
        if (!author) {
            alert("Please choose valid author.");
            return;
        }
        if (!title) {
            alert("Title must not be empty.");
            return;
        }
        if (!description) {
            alert("Description must not be empty.");
            return;
        }
        if (price < 10 || price > 100) {
            alert("Price must be between 10 and 100.");
            return;
        }
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const books = snapshot.val();
            const bookExists = Object.values(books).some(
                (book: any) => book.title === title && book.author === author
            );
            if (bookExists) {
                alert("This Book Is Already Added");
                return;
            }
        }
        const newDocRef = push(dbRef);
        set(newDocRef, {
            title: title,
            price: price,
            description: description,
            category: category,
            pictureUrl: pictureUrl,
            author: author,
            activeStatus: activeStatus,
        }).then(() => {
            console.log("Saved book");
        }).catch((err) => {
            alert("Server Error");
            console.log("Error is: ", err);
        });
    };

    const fetchAuthorData = async () => {
        const db = getDatabase(app);
        const dbref = ref(db, 'IMDBooks/Authors/');
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            setAuthorsArray(Object.values(snapshot.val()));
        } else {
            alert("DB Error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAuthorData();
    }, []);

    return (
        <>
        <h1>Create A Book Page</h1>
        <NavBar/>
        <div className="create-book-container">
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Picture'
                        value={pictureUrl}
                        onChange={(e) => setPictureUrl(e.target.value)}
                    />
                    <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    >
                        <option value="">Select an Author</option>
                        {authorsArray.map((author, index) => (
                            <option key={index} value={author.name}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={saveData}>Send Data</button>
                </>
            )}
        </div>
        </>
    );
    
}
