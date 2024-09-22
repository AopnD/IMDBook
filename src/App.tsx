import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"
import BookPage from "./components/BookPage"
import AuthorsPage from "./components/AuthorsPage"
import CreateBookPage from "./components/CreateBookPage"
import CreateAuthor from "./components/CreateAuthor"
import BookDetail from "./components/BookDetail"
import './App.css'



function App() {

  return (
    <>
<div>
  <Router>
    <Routes>
      <Route path="/" element= {<HomePage/>}/>
      <Route path="/books" element= {<BookPage/>}/>
      <Route path="/authors" element= {<AuthorsPage/>}/>
      <Route path="/createbook" element= {<CreateBookPage/>}/>
      <Route path="/createauthor" element= {<CreateAuthor/>}/>
      <Route path="/book-detail" element={<BookDetail />}  /> 
    </Routes>
  </Router>
</div>
    </>
  )
}

export default App
