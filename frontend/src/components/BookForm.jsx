import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

const EMPTY = { title: '', author: '', publisher: '', category: '', isbn: '', price: '', available: true };

export default function BookForm({ editingBook, onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(editingBook
      ? { title: editingBook.title, author: editingBook.author, publisher: editingBook.publisher,
          category: editingBook.category, isbn: editingBook.isbn, price: editingBook.price,
          available: editingBook.available }
      : EMPTY);
    setError('');
  }, [editingBook]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editingBook) {
        await bookService.update(editingBook.id, payload);
        onSuccess(`"${payload.title}" updated.`);
      } else {
        await bookService.create(payload);
        onSuccess(`"${payload.title}" added.`);
        setForm(EMPTY);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>{editingBook ? '✏️ Edit Book' : '➕ Add Book'}</h2>
      {error && <p className="alert alert-error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {[['title','Title'],['author','Author'],['publisher','Publisher'],['category','Category'],['isbn','ISBN']].map(([field, label]) => (
            <div className="form-group" key={field}>
              <label htmlFor={`f-${field}`}>{label} *</label>
              <input id={`f-${field}`} name={field} value={form[field]} onChange={onChange} required />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="f-price">Price *</label>
            <input id="f-price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={onChange} required />
          </div>
        </div>
        <label className="checkbox-label">
          <input type="checkbox" name="available" checked={form.available} onChange={onChange} />
          Available
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : editingBook ? 'Update' : 'Add Book'}
          </button>
          {editingBook && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </section>
  );
}
