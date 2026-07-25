import { useState } from 'react';
import { bookService } from '../services/bookService';

export default function SearchBook() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!id) return;
    setLoading(true); setError(''); setResult(null);
    try {
      setResult(await bookService.getById(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clear() { setId(''); setResult(null); setError(''); }

  return (
    <section className="card">
      <h2>🔍 Search by ID</h2>
      <form onSubmit={handleSearch} className="search-bar">
        <input type="number" min="1" value={id} onChange={e => setId(e.target.value)} placeholder="Book ID" required />
        <button className="btn btn-primary" disabled={loading}>{loading ? '…' : 'Search'}</button>
        {(result || error) && <button type="button" className="btn btn-secondary" onClick={clear}>Clear</button>}
      </form>
      {error && <p className="alert alert-error">{error}</p>}
      {result && (
        <div className="table-wrap" style={{ marginTop: '12px' }}>
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Publisher</th><th>Category</th><th>ISBN</th><th>Price</th><th>Available</th></tr></thead>
            <tbody>
              <tr>
                <td>{result.id}</td><td>{result.title}</td><td>{result.author}</td>
                <td>{result.publisher}</td><td>{result.category}</td>
                <td className="mono">{result.isbn}</td>
                <td>${parseFloat(result.price).toFixed(2)}</td>
                <td><span className={`badge ${result.available ? 'yes' : 'no'}`}>{result.available ? 'Yes' : 'No'}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
