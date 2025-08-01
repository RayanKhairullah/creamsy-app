"use client";
import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productService";
import { uploadImage } from "@/lib/storageService";
import { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSave: (data: Omit<Product, "id">, id?: string, imageFile?: File) => Promise<void>;
  onCancel: () => void;
}

function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [type, setType] = useState<Product["type"]>(product?.type || "base");
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !type) return;
    await onSave({ name, price: Number(price), type, image: product?.image || '' }, product?.id, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 text-black rounded shadow max-w-md mx-auto">
      <h2 className="font-bold text-lg mb-2">{product ? "Edit" : "Tambah"} Produk</h2>
      <input className="w-full border p-2 rounded" placeholder="Nama produk" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Harga" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <select className="w-full border p-2 rounded" value={type} onChange={e => setType(e.target.value as Product["type"])}>
        <option value="base">Base</option>
        <option value="topping">Topping</option>
      </select>
      <input type="file" accept="image/png, image/jpeg, image/jpg" className="w-full border p-2 rounded" onChange={e => setImageFile(e.target.files?.[0])} />
      <div className="flex gap-2">
        <button type="submit" className="bg-ice-cream-500 text-black px-4 py-2 rounded font-semibold">Simpan</button>
        <button type="button" className="bg-gray-200 text-black px-4 py-2 rounded" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setProducts(await getProducts());
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (data: Omit<Product, "id">, id?: string, imageFile?: File) => {
    let imageUrl = data.image;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const productData = { ...data, image: imageUrl };

    if (id) {
      await updateProduct(id, productData);
    } else {
      await createProduct(productData);
    }
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>
      {showForm || editing ? (
        <ProductForm product={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      ) : (
        <>
          <button className="mb-4 bg-ice-cream-500 text-black px-4 py-2 rounded font-semibold" onClick={() => setShowForm(true)}>Tambah Produk</button>
          {loading ? <div>Loading...</div> : (
            <table className="w-full border rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Harga</th>
                  <th className="p-2 text-left">Tipe</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-t">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">Rp {product.price.toLocaleString()}</td>
                    <td className="p-2">{product.type}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-yellow-300 px-2 py-1 rounded" onClick={() => { setEditing(product); setShowForm(true); }}>Edit</button>
                      <button className="bg-red-400 text-white px-2 py-1 rounded" onClick={() => handleDelete(product.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
