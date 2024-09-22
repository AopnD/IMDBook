import { useEffect, useState } from 'react';
import app from '../firebaseconfig';
import { getDatabase, ref, get } from 'firebase/database';
import BookCard from './BookCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/BookPage.css';

type Book = {
  title: string;
  activeStatus: boolean;
  author: string;
  category: string;
  description: string;
  pictureUrl: string;
  price: number;
};

type Author = {
  name: string; 
};

export default function BookPage() {
  const [booksArray, setBooksArray] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorsArray, setAuthorsArray] = useState<Author[]>([]);

  useEffect(() => {
    fetchData();
    fetchAuthorData(); 
  }, []);

  const fetchData = async () => {
    try {
      const db = getDatabase(app);
      const dbref = ref(db, 'IMDBooks/Books/');
      const snapshot = await get(dbref);
  
      if (snapshot.exists()) {
        const booksData = snapshot.val();
        setBooksArray(Object.values(booksData)); 
      } else {
        alert("No books found in the database.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error retrieving books from the database.");
    } finally {
      setLoading(false); 
    }
  };
  ;

  const fetchAuthorData = async () => {
    const db = getDatabase(app);
    const dbref = ref(db, 'IMDBooks/Authors/');
    const snapshot = await get(dbref);
    if (snapshot.exists()) {
      setAuthorsArray(Object.values(snapshot.val()));
    } else {
      alert("DB Error");
    }
  };

  return (
    <>
<div className="container-fluid book-wrap">
  {loading ? (
    <p>Loading...</p>
  ) : (
    authorsArray.map((author, index) => (
      <div key={index} className='book-slide-bar'>
        <h1>{author.name}</h1>
        <div className="author-books">
          <div className="row flex-nowrap">
            {booksArray
              .filter(book => book.author === author.name) 
              .map((book, bookIndex) => (
                <BookCard key={bookIndex} book={book} />
              ))}
          </div>
        </div>
      </div>
    ))
  )}
</div>
    </>
  );
}
