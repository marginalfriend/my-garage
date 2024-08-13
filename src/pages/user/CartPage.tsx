import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatIDR } from "../../utils/utils";
import { useAuth } from "../../hooks/useAuth";
import { updateCartItem } from "../../apis/cartApi";
import { ORDER } from "../../constants/routes";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { account, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    // Update quantity in the backend and then update local state
    try {
      await updateCartItem(account.id, id, newQuantity, token);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      alert("Failed to update cart quantity.");
    }
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prevChecked) => {
      const newChecked = new Set(prevChecked);
      if (newChecked.has(id)) {
        newChecked.delete(id);
      } else {
        newChecked.add(id);
      }
      return newChecked;
    });
  };

  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => checkedItems.has(item.id))
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!account) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = cartItems
        .filter((item) => checkedItems.has(item.id))
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      // Clear checked items from the cart
      setCartItems((prevItems) =>
        prevItems.filter((item) => !checkedItems.has(item.id))
      );
      setCheckedItems(new Set());

      // Navigate to order confirmation page
      navigate(`${ORDER}/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">Your Cart</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-accent text-contrast">
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">Quantity</th>
            <th className="p-2 text-right">Price / Unit</th>
            <th className="p-2 text-right">Total</th>
            <th className="p-2 text-center">Select</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="p-2">
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="p-2 text-default">{item.product.name}</td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="w-16 text-center border border-gray-300 rounded"
                />
              </td>
              <td className="p-2 text-right text-default">
                {formatIDR(item.product.price)}
              </td>
              <td className="p-2 text-right text-default">
                {formatIDR(item.product.price * item.quantity)}
              </td>
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="form-checkbox h-5 w-5 text-accent"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 text-right">
        <p className="text-xl font-semibold text-heading">
          Estimated Total:{" "}
          <span className="text-accent">
            {formatIDR(calculateTotalPrice())}
          </span>
        </p>
        <button
          className="mt-4 bg-accent text-contrast py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          onClick={handleCheckout}
          disabled={isLoading || checkedItems.size === 0}
        >
          {isLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
