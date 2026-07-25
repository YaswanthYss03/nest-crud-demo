import { useState } from 'react';
import { bookService } from '../services/bookService';

export default function BookTable({ books, loading, onEdit, onRefresh, onMessage }) {
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    setDeleting(book.id);
    try {
      await bookService.remove(book.id);
      onMessage(`"${book.title}" deleted.`, 'success');
      onRefresh();
    } catch (err) {
      onMessage(err.message, 'error');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <div className="loading"><span className="spinner" /> Loading books…</div>;

  if (books.length === 0) return <p className="empty">No books available.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Author</th><th>Publisher</th>
            <th>Category</th><th>ISBN</th><th>Price</th><th>Available</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.category}</td>
              <td className="mono">{book.isbn}</td>
              <td>${parseFloat(book.price).toFixed(2)}</td>
              <td><span className={`badge ${book.available ? 'yes' : 'no'}`}>{book.available ? 'Yes' : 'No'}</span></td>
              <td className="actions">
                <button className="btn btn-sm btn-edit" onClick={() => onEdit(book)}>Edit</button>
                <button className="btn btn-sm btn-del" disabled={deleting === book.id} onClick={() => handleDelete(book)}>
                  {deleting === book.id ? '…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
