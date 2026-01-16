import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { booksService } from './services/booksService';
import SearchBar from './components/SearchBar';
import MetricsCard from './components/MetricsCard';
import BooksList from './components/BooksList';

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async (authorFilter = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await booksService.getMetrics(authorFilter);
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSearch = () => {
    fetchMetrics(author);
  };

  const handleClear = () => {
    setAuthor('');
    fetchMetrics('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Book className="w-10 h-10 text-indigo-600" />
            Book Metrics Dashboard
          </h1>
          <p className="text-gray-600">Explora estadísticas de libros y autores</p>
        </div>

        {/* Search Bar */}
        <SearchBar
          author={author}
          setAuthor={setAuthor}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Content */}
        {metrics && !loading && (
          <div className="space-y-6">
            <MetricsCard metrics={metrics} />
            <BooksList books={metrics.books_written_by_author} author={author} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando métricas...</p>
          </div>
        )}
      </div>
    </div>
  );
}