import { Image } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { NavLink } from "react-router-dom";
import { ADMIN_PRODUCTS } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

type Product = {
  id: string;
  isActive: boolean;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: { id: string; url: string; productId: string }[];
};

type Category = {
  id: string;
  name: string;
};

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<FileList | null>(null);
  const [keepImageIds, setKeepImageIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description || "");
        setStock(data.stock);
        setCategoryId(data.categoryId);
        setIsActive(data.isActive);
        setKeepImageIds(data.images.map((image: Image) => image.id));
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("stock", stock.toString());
    formData.append("categoryId", categoryId);
    formData.append("isActive", isActive.toString());
    formData.append("keepImageIds", JSON.stringify(keepImageIds));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/products");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const toggleKeepImage = (imageId: string) => {
    setKeepImageIds((prevIds) =>
      prevIds.includes(imageId)
        ? prevIds.filter((id) => id !== imageId)
        : [...prevIds, imageId]
    );
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-heading text-2xl font-semibold mb-4">
          Edit Product
        </h1>
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div>
            <label className="block text-default font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-default font-medium">
              Price (IDR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-default font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <div>
            <label className="block text-default font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-default font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-default font-medium">Active</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-accent border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-default font-medium">
              Existing Images
            </label>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="Product"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                  <input
                    type="checkbox"
                    checked={keepImageIds.includes(image.id)}
                    onChange={() => toggleKeepImage(image.id)}
                    className="absolute top-0 right-0 mt-2 mr-2"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-default font-medium">Add Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <NavLink to={ADMIN_PRODUCTS}>
              <Button variant="danger">Cancel</Button>
            </NavLink>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProductPage;
