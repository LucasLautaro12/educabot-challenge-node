import React from 'react';
import { Book } from 'lucide-react';

export default function BooksList({ books, author }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Libros del Autor
        {author && <span className="text-indigo-600"> ({author})</span>}
      </h3>
      
      {books.length > 0 ? (
        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{book.name}</h4>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">${book.price}</p>
                {book.units_sold && (
                  <p className="text-sm text-gray-500">
                    {book.units_sold.toLocaleString('es-AR')} vendidos
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Book className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p>
            {author 
              ? `No se encontraron libros de "${author}"`
              : 'Busca por autor para ver sus libros'
            }
          </p>
        </div>
      )}
    </div>
  );
}