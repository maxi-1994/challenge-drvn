export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}
  
export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: Dimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: Review[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: Meta;
    thumbnail: string;
    images: string[];
}
  
export interface Meta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}
  
export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}
  
export interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

export type ProductTable = Pick<Product, 'id' | 'thumbnail' | 'title' | 'brand' | 'price' | 'stock' | 'rating'>;
export type ProductDetails = Pick<Product, 'id' | 'title' | 'brand'  | 'stock' | 'price' | 'rating' | 'discountPercentage' | 'description' | 'images'>;
export type ProductUpdateBody = Pick<Product, 'title' | 'stock' | 'price' |'description'>;