import React from 'react';
import { Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value);
    if (isNaN(qty) || qty < 1) return; // prevents invalid values
    updateQuantity(item._id, qty);      // <-- sets exact quantity
  };

  return (
    <tr className="border border-gray-200 text-center font-bold">
      <td className="px-4 py-2 border-r border-gray-200">
        <button onClick={() => removeFromCart(item._id)}>
          <Trash className="text-[#00BBA6] w-5 h-5 hover:text-red-500 transition-colors duration-200 cursor-pointer" />
        </button>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <img
          src={item.image || "/assets/img/cart/cart17.jpg"}
          alt={item.name}
          className="w-16 h-16 object-cover mx-auto"
        />
      </td>
      <td className="px-4 py-2 text-center border-r border-gray-200">{item.name}</td>
      <td className="px-4 py-2 text-[#00BBA6] border-r border-gray-200">£{item.price.toFixed(2)}</td>
      <td className="px-4 py-2 text-center border-r border-gray-200">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 md:w-24 text-center border border-gray-300 font-medium px-2 py-1"
        />
      </td>
      <td className="px-4 py-2 text-[#00BBA6]">
        £{(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  );
};

export default CartItem;
