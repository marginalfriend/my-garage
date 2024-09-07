/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatIDR } from "../../utils/utils";
import { useAuth } from "../../hooks/useAuth";
import { ORDER, USER_PRODUCTS } from "../../constants/routes";
import Button from "../../components/Button";
import { NavLink } from "react-router-dom";
import { checkStock } from "../../apis/orderApi";
import emailjs from "@emailjs/browser";
import { updateCartItem } from "../../apis/cartApi";
import { deleteCartItem } from "../../apis/cartApi";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
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
    console.log(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
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

      if (response.ok) {
        const order = await response.json();

        const productNames = await checkStock(token, order.id);
        console.log("Product names: " + JSON.stringify(productNames));

        if (productNames[0]) {
          for (const product_name of productNames) {
            emailjs.send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID,
              import.meta.env.VITE_TEMPLATE_ID,
              { product_name },
              { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
            );
          }
        }

        // Fetch updated cart items from the server
        await fetchCartItems();

        // Clear checked items
        setCheckedItems(new Set());

        // Navigate to order confirmation page
        navigate(`${ORDER}/${order.id}`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Optimistic update
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );

    try {
      await updateCartItem(account!.id, item.productId, newQuantity, token);
    } catch (error) {
      console.error("Error updating cart item:", error);
      // Revert the optimistic update
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: item.quantity }
            : cartItem
        )
      );
      alert("Failed to update cart item. Please try again.");
    }
  };

  const handleDeleteItem = async (item: CartItem) => {
    try {
      await deleteCartItem(item.productId, token, account!.id);
      // Remove the item from the local state
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      );
      // Remove the item from checked items if it was checked
      setCheckedItems((prevChecked) => {
        const newChecked = new Set(prevChecked);
        newChecked.delete(item.id);
        return newChecked;
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to delete cart item. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">Your Cart</h1>
      {cartItems[0] ? (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-accent text-contrast">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Quantity</th>
                <th className="p-2 text-right">Price / Unit</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-center">Select</th>
                <th className="p-2 text-center">Actions</th>
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
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        className="p-2 bg-gray-200 rounded-l disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        className="p-2 bg-gray-200 disabled:opacity-30 rounded-r"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
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
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
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
        </>
      ) : (
        <div className="flex flex-col gap-4 justify-center items-center">
          <img
            src="https://img.freepik.com/free-vector/empty-shopping-basket-concept-illustration_114360-17072.jpg?t=st=1723555699~exp=1723559299~hmac=e191bab40b4d93b4e2740c84578158af2959cbd6ebc885d9b4a53659a90b7cf8&w=740"
            width={250}
          />
          <p>Your cart is empty...</p>
          <NavLink to={USER_PRODUCTS}>
            <Button>Go check our products!</Button>
          </NavLink>
        </div>
      )}
    </main>
  );
};

export default CartPage;
