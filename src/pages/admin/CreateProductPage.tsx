import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useNavigate } from "react-router-dom";
import { ADMIN_PRODUCTS } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Button";

const CreateProductPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<string>("");
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPrice(value);
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setStock(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("categoryId", selectedCategory?.value || "");

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(ADMIN_PRODUCTS);
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
              Part Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Brake Pad, Oil Filter"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (in IDR)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
              placeholder="e.g., 500000"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              placeholder="Provide details about the spare part"
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
              type="text"
              id="stock"
              value={stock}
              onChange={handleStockChange}
              required
              placeholder="e.g., 100"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
