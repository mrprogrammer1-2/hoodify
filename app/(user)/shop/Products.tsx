import { getHoodies } from "@/lib/queries/productQueries";
import Link from "next/link";
import Image from "next/image";
export default async function Products() {
  const hoodies = await getHoodies();
  console.log(hoodies);
  if (hoodies)
    return (
      <main className="w-screen min-h-dvh">
        <div className="max-container">
          <h1 className="text-3xl font-bold my-6">Products</h1>
          {hoodies.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hoodies.map((product) => (
                <li
                  className="border p-4 rounded-lg shadow hover:shadow-lg transition"
                  key={product.id}
                >
                  <Link href={`/shop/${product.id}`} className="block">
                    <h2 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h2>
                    <Image
                      src={
                        product.images.find((img: any) => img.place === "front")
                          ?.url || product.images[0]?.url
                      }
                      alt={product.name}
                      width={300}
                      height={300}
                      className="mb-4 object-cover w-full h-48 rounded"
                      loading="eager"
                    />
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    );
}
