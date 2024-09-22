import { useEffect, useState } from 'react';
import app from '../firebaseconfig';
import { getDatabase, ref, get, update } from 'firebase/database';
import '../style/AuthorsPage.css';
import NavBar from './NavBar';

type Author = {
  name: string;
  age: number;
  country: string;
  pictureUrl: string;
  activeStatus: boolean;
};

export default function AuthorsPage() {
  const [authorsArray, setAuthorsArray] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
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

  const upDateAuthorStatus = async (authorName: string) => {
    if (!authorName) return;
  
    try {
      const db = getDatabase();
      const dbRef = ref(db, 'IMDBooks/Authors/');
      const snapshot = await get(dbRef);
  
      if (snapshot.exists()) {
        const authors = snapshot.val();
        const matchingAuthorKey = Object.keys(authors).find(
          (key) => authors[key].name === authorName
        );
  
        if (matchingAuthorKey) {
          const newStatus = authors[matchingAuthorKey].activeStatus ? false : true; // Toggle boolean status
          const authorRef = ref(db, `IMDBooks/Authors/${matchingAuthorKey}`);
          await update(authorRef, { activeStatus: newStatus });
  
          // Update local state
          setAuthorsArray((prevAuthors) =>
            prevAuthors.map((author) =>
              author.name === authorName ? { ...author, activeStatus: newStatus } : author
            )
          );
  
          console.log(`Toggled ${authorName}'s active status to ${newStatus ? 'Active' : 'Inactive'}`);
        } else {
          console.log('Author not found.');
        }
      } else {
        console.log('No authors available in the database.');
      }
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="authors-page">
      <h1>Authors</h1>
      <NavBar/>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="authors-container">
          {authorsArray.map((author, index) => (
            <div key={index} className="author-detail">
              {author.pictureUrl && <img src={author.pictureUrl} alt={author.name} />}
              <div className="text">
                <h2>{author.name}</h2>
                <p><strong>Age:</strong> {author.age}</p>
                <p><strong>Country:</strong> {author.country}</p>
                <p><strong>Status:</strong> {author.activeStatus ? 'Active' : 'Inactive'}</p>
                <button onClick={() => upDateAuthorStatus(author.name)} className="icon-button">
                      <i
                        className={`bi ${author.activeStatus ? 'bi-toggle-on text-success' : 'bi-toggle-off text-danger'}`}
                            style={{ fontSize: '2rem' }}
                          ></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
