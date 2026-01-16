import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function MetricsCard({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mean Units Sold */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Promedio de Ventas</h3>
        </div>
        <p className="text-3xl font-bold text-gray-800">
          {metrics.mean_units_sold !== null 
            ? metrics.mean_units_sold.toLocaleString('es-AR', { maximumFractionDigits: 0 })
            : 'N/A'
          }
        </p>
        <p className="text-sm text-gray-500 mt-1">unidades vendidas</p>
      </div>

      {/* Cheapest Book */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Libro Más Barato</h3>
        </div>
        {metrics.cheapest_book ? (
          <>
            <p className="text-xl font-bold text-gray-800">{metrics.cheapest_book.name}</p>
            <p className="text-sm text-gray-600 mt-1">{metrics.cheapest_book.author}</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${metrics.cheapest_book.price}
            </p>
          </>
        ) : (
          <p className="text-gray-500">No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
}