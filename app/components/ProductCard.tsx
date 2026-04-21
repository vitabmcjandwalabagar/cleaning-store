import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
}: ProductCardProps) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <h2 className="text-lg font-semibold mt-4">{name}</h2>
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
      <p className="text-xl font-bold mt-3">₹{price}</p>

      <div className="mt-4">
        <AddToCartButton
          id={id}
          name={name}
          price={price}
          image={image}
        />
      </div>
    </div>
  );
}