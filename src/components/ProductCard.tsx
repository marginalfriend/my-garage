// components/ProductCard.tsx
import React from "react";
import { Product } from "@prisma/client";
import { formatIDR } from "../utils/utils";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex flex-col border w-full rounded-lg shadow-md">
      <div className="w-full h-60 border-b">
        <img
          src={product.images[0].url}
          alt={product.name + " Image"}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <div className="flex flex-col p-4 gap-2 bg-default bg-opacity-20 rounded-b-lg flex-grow">
        <h2 className="font-semibold text-sm">{product.name}</h2>
        <h3 className="font-medium text-xs">{formatIDR(product.price)}</h3>
        <div className="mt-auto">
          <Button variant="primary">See Details</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
