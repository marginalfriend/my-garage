import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const CreateProductPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const loadCategories = async (inputValue: string) => {
    // Replace this with your API call to fetch categories
    const response = await fetch(`/api/categories?query=${inputValue}`);
    const data = await response.json();
    return data.map((category: { id: string; name: string }) => ({
      value: category.id,
      label: category.name,
    }));
  };

  const handleCreateCategory = async (inputValue: string) => {
    // Replace this with your API call to create a new category
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ name: inputValue, isActive: true }),
    });
    const newCategory = await response.json();
    const newOption = { value: newCategory.id, label: newCategory.name };
    setSelectedCategory(newOption);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("stock", stock.toString());
    formData.append("categoryId", selectedCategory?.value || "");

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      console.log();
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(PRODUCTS);
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <main className="flex justify-center align-middle">
      <div className="container w-[50%] p-4">
        <h1 className="text-2xl font-semibold text-heading mb-4">
          Create New Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <AsyncCreatableSelect
              id="category"
              cacheOptions
              defaultOptions
              loadOptions={loadCategories}
              onCreateOption={handleCreateCategory}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500"
            />
            <div className="mt-2 flex flex-wrap">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-24 h-24 m-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit">Create Product</Button>
        </form>
      </div>
    </main>
  );
};

export default CreateProductPage;
