"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function SingleProductClient({
  product,
}: {
  product: SingleProductClientType;
}) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Link href={`/admin/products/edit?productId=${product.id}`}>
          <Button>Edit Product</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{product.description || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">EGP {product.price}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline">{product.type}</Badge>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <Badge variant={product.featured ? "default" : "secondary"}>
                  {product.featured ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customizable</p>
                <Badge
                  variant={product.isCustomizable ? "default" : "secondary"}
                >
                  {product.isCustomizable ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <Badge variant={product.isActive ? "default" : "destructive"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((image) => (
                <div key={image.id} className="space-y-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    {image.color && <p>Color: {image.color}</p>}
                    {image.place && <p>Place: {image.place}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="h-12 px-4 text-left font-semibold">Color</th>
                  <th className="h-12 px-4 text-left font-semibold">Size</th>

                  <th className="h-12 px-4 text-left font-semibold">Stock</th>
                  <th className="h-12 px-4 text-left font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.id} className="border-b">
                    <td className="p-4">{variant.color}</td>
                    <td className="p-4">{variant.size || "N/A"}</td>

                    <td className="p-4">{variant.stock}</td>
                    <td className="p-4">
                      {variant.price ? `EGP ${variant.price}` : "Default"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
