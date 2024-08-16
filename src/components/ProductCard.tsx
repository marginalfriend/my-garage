// components/ProductCard.tsx
import React from "react";
import { formatIDR } from "../utils/utils";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { USER_PRODUCTS } from "../constants/routes";
import { ExtendedProduct } from "../pages/user/ProductsPage";

interface ProductCardProps {
  product: ExtendedProduct
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col border w-full rounded-lg shadow-md">
      <div className="w-full h-60 border-b">
        <img
          src={product.images[0].url}
          alt={product.name + " Image"}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <div className="flex flex-col p-4 gap-2 bg-default bg-opacity-5 rounded-b-lg flex-grow">
        <h2 className="font-semibold text-sm">{product.name}</h2>
        <h2 className="font-medium text-xs">Category: {product.category.name}</h2>
        <h3 className="font-medium text-xs">Price: {formatIDR(product.price)}</h3>
        <h3 className="font-medium text-xs">
          Available stock: {product.stock}
        </h3>
        <div className="mt-auto">
          <Button
            variant="primary"
            onClick={() => navigate(USER_PRODUCTS + "/" + product.id)}
          >
            See Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
