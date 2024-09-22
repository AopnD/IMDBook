import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import '../style/BookDetail.css';

type Book = {
    title: string;
    activeStatus: boolean;
    author: string;
    category: string;
    description: string;
    pictureUrl: string;
    price: number;
}


const BookDetail = () => {
    const location = useLocation();
    const [book, setBook] = useState(location.state); // Use state for book
  
    const upDateData = async () => {
      if (!book) return;
      const { author, title } = book;
      try {
        const db = getDatabase();
        const dbRef = ref(db, 'IMDBooks/Books/');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const books = snapshot.val();
          const matchingBookKey = Object.keys(books).find(
            (key) => books[key].author === author && books[key].title === title
          );
          if (matchingBookKey) {
            const newStatus = !book.activeStatus;
            const bookRef = ref(db, `IMDBooks/Books/${matchingBookKey}`);
            await update(bookRef, { activeStatus: newStatus });
            setBook((prevBook: Book) => ({ ...prevBook, activeStatus: newStatus }));
            console.log(`Toggled ${title} by ${author}'s activeStatus to ${newStatus}`);
          } else {
            console.log('Book not found.');
          }
        } else {
          console.log('No books available in the database.');
        }
      } catch (error) {
        console.error('Error updating book:', error);
      }
    };
  
    return (
      <div className="book-detail">
        {book ? (
          <>
            <img src={book.pictureUrl} alt={book.title} />
            <div className="text">
            <button onClick={upDateData} className="icon-button">
                <i
                  className={`bi ${book.activeStatus ? 'bi-toggle-on text-success' : 'bi-toggle-off text-danger'}`}
                  style={{ fontSize: '2rem' }}
                ></i>
              </button>
              <h1>{book.title}</h1>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <p><strong>Price:</strong> ${book.price.toFixed(2)}</p>
              <p><strong>Status:</strong> {book.activeStatus ? 'Active' : 'Inactive'}</p>
              <div className="btn-wrapper">
                <Link to="/" className="back-button">Back to Home</Link>
              </div>
            </div>
          </>
        ) : (
          <p>No book data available.</p>
        )}
      </div>
    );
  };
  
  export default BookDetail;
