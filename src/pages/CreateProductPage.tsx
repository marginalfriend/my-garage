import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

const CreateProductPage: React.FC = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    images: [] as File[],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    data.append("categoryId", formData.categoryId);
    formData.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const header = new Headers();

      header.append("Authorization", token);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: header,
        body: data,
      });

      if (response.ok) {
        // Handle success
        console.log("Product created successfully");
      } else {
        // Handle error
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-heading text-2xl mb-6">Create New Product</h2>

        <div className="mb-4">
          <label className="block text-default mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-default rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-default mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-default rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-default mb-2" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full p-2 border border-default rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-default mb-2" htmlFor="categoryId">
            Category ID
          </label>
          <input
            type="text"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className="w-full p-2 border border-default rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-default mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-default rounded"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-default mb-2" htmlFor="images">
            Product Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            className="w-full p-2 border border-default rounded"
            multiple
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent text-contrast p-2 rounded hover:bg-heading"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
