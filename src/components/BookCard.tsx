import { Link } from 'react-router-dom';
import '../style/BookCard.css'

type Book = {
    title: string;
    activeStatus: boolean;
    author: string;
    category: string;
    description: string;
    pictureUrl: string;
    price: number;
  }

  type BookCardProps = {
    book: Book; 
  }

export default function BookCard({book}: BookCardProps) {
  return (
    <div className='book-card'>
        <Link to="/book-detail" state={book}>
        <img src={book.pictureUrl} alt={book.title} />
        </Link>
        <div className='overlay d-flex align-items-center justify-content-center'>
        <Link to="/book-detail" state={book}>
          <span className='mr-2'>{book.title}</span>
          </Link>
        </div>
        </div>
  )
}
