import { Link } from 'react-router-dom';
import '../style/HomePage.css'

export default function NavBar() {
  return (
    <nav>
    <ul>
    <li><Link to="/">Home Page</Link></li>
      <li><Link to="/authors">Authors</Link></li>
      <li><Link to="/createbook">Create Book</Link></li>
      <li><Link to="/createauthor">Create Author</Link></li>
    </ul>
  </nav>
  )
}
