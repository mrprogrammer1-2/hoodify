// import * as fabric from "fabric";

type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  type: "hoodie" | "ticket";
  featured?: boolean;
  isCustomizable?: boolean;
};

type Variant = {
  color: string;
  size?: string;
  stock: number;
  price?: number;
};

type ProductImageInput = {
  url: string;
  place: "front" | "back" | "left-sleeve" | "right-sleeve";
  color?: string;
  position: number;
};

type User = {
  id: string;
  kindeId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

type Order = {
  id: string;
  userId: string;
  status:
    | "cart"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalPrice: number;
  currency: string;
  createdAt: Date;
};

type SingleProductClientType = {
  images: {
    id: string;
    productId: string;
    url: string;
    altText: string | null;
    color: string | null;
    position: number | null;
    place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  }[];
  variants: {
    id: string;
    productId: string;
    color: string;
    size: string | null;
    stringColor: string | null;
    stock: number | null;
    price: number | null;
  }[];
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: "hoodie" | "ticket";
  featured: boolean;
  isCustomizable: boolean;
  isActive: boolean | null;
  createdAt: Date;
};

type View = "front" | "back" | "left-sleeve" | "right-sleeve";

type CartItem = {
  orderId?: string;
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  variantColor?: string;
  variantSize?: string;
  quantity?: number;
  itemType?: "hoodie" | "ticket";
  // customization?: Record<string, any>;
  className?: string;
  image: string;
};

type CartItemType = "hoodie" | "ticket";

type mouseDownType = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: React.MutableRefObject<string | null>;
};

type CustomFabricObject<T extends fabric.Object> = T & {
  objectId: string;
};

type ShapesMenuProps = {
  item: {
    name: string;
    icon: string;
    value: ActiveElement[] | string;
  };
  activeElement: any;
  handleActiveElement: any;
  handleImageUpload: any;
  imageInputRef: any;
  isActive: any;
};
type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef?: React.MutableRefObject<HTMLInputElement | null>;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
  onUndo: () => void;
  onRedo: () => void;
};

type ActiveElement = {
  name: string;
  value: string | ActiveElement[]; // allow nested groups like `shapeElements`
  icon: string;
  title?: string;
};

type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: React.MutableRefObject<string | null>;
};

type CanvasMouseUp = {
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  // activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  selectedShapeRef: React.MutableRefObject<string | null>;
  setActiveElement: any;
  undoStackRef: React.MutableRefObject<any[]>;
  redoStackRef: React.MutableRefObject<any[]>;
  isRestoringHistory: React.MutableRefObject<boolean>;
};

type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<fabric.Canvas | null>;
  isEditingRef: React.MutableRefObject<boolean>;
  undoStackRef: React.MutableRefObject<any[]>;
  redoStackRef: React.MutableRefObject<any[]>;
  isRestoringHistory: React.MutableRefObject<boolean>;
};

type CanvasSelectionCreated = {
  options: fabric.IEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

type Attributes = {
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};
