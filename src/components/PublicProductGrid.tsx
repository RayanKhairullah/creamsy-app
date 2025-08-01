// src/components/PublicProductGrid.tsx
import { Product } from '@/types';

interface PublicProductGridProps {
  products: Product[];
}

export default function PublicProductGrid({ products }: PublicProductGridProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Ice Cream Flavors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => p.type === 'base')
            .map((product) => (
              <div
                key={product.id}
                className="bg-ice-cream-50 rounded-xl p-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-full mb-3"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="font-bold text-center text-gray-900">{product.name}</div>
                  <div className="text-gray-900 font-medium">
                    Rp {product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Toppings & Add-ons</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products
            .filter((p) => p.type === 'topping')
            .map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-full mr-3"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mr-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">T</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-900">
                      +Rp {product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}