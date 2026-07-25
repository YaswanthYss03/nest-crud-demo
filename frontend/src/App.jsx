import { useState, useEffect, useCallback } from 'react';
import BookForm from './components/BookForm';
import BookTable from './components/BookTable';
import SearchBook from './components/SearchBook';
import { bookService } from './services/bookService';

export default function App() {
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [msg, setMsg]               = useState({ text: '', type: '' });

  function flash(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  }

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try { setBooks(await bookService.getAll()); }
    catch (err) { flash(err.message, 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  function handleFormSuccess(text) {
    flash(text);
    setEditingBook(null);
    fetchBooks();
  }

  return (
    <div className="app">
      <header>
        <h1>📚 Book Management System</h1>
        <p>Your digital library catalogue</p>
      </header>

      <main>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <BookForm
          editingBook={editingBook}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingBook(null)}
        />

        <SearchBook />

        <section className="card">
          <div className="section-header">
            <h2>📋 All Books</h2>
            <button className="btn btn-secondary btn-sm" onClick={fetchBooks}>↻ Refresh</button>
          </div>
          <BookTable
            books={books}
            loading={loading}
            onEdit={book => { setEditingBook(book); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onRefresh={fetchBooks}
            onMessage={flash}
          />
        </section>
      </main>

      <footer><p>Book Management System © {new Date().getFullYear()}</p></footer>
    </div>
  );
}
