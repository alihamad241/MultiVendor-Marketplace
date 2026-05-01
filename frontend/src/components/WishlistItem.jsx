import React from 'react'
import { useCartStore } from "../stores/useCartStore";

const WishlistItem = ({item}) => {
 const { removeFromWishlist,addToCart } = useCartStore();

  return (
    <tr className="border border-gray-200 text-center font-bold">
      <td className="px-4 py-2 border-r border-gray-200">
        <button onClick={() => removeFromWishlist(item._id)}>
          <span className="text-[#00BBA6] w-5 h-5 hover:text-red-500 font-medium text-2xl cursor-pointer transition-colors duration-200">X</span>
        </button>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <img
          src={item.image || "assets/img/cart/cart17.jpg"}
          alt={item.name}
          className="w-16 h-16 object-cover mx-auto"
        />
      </td>
      <td className="px-4 py-2 text-center border-r border-gray-200">{item.name}</td>
      <td className="px-4 py-2 text-[#00BBA6] border-r border-gray-200">${item.price.toFixed(2)}</td>
      <td className="px-4 py-2 text-[#00BBA6]">
        <button 
        onClick={()=>addToCart(item._id)}
        className="px-4 inline-block bg-[#00BBA6] text-white py-2 font-bold hover:bg-red-500 cursor-pointer transition-colors duration-200">
          ADD TO CART
        </button>
      </td>
    </tr>
  );
}

export default WishlistItem