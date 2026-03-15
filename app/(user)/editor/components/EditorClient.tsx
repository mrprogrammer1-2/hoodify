"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CanvasContainer from "./CanvasContainer";
import * as fabric from "fabric";
import {
  handleCanvasSelectionCreated,
  handleImageUpload,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleResize,
  initializeCanvas,
  redo,
  saveHistory,
  undo,
} from "@/lib/canvas";
import EditorNav from "./EditorNav";
import { handleDelete } from "@/lib/key-events";
import { defaultNavElement } from "@/constants";
import RightBar from "./RightBar";
import ViewTabs from "./ViewTabs";
import { useSearchParams } from "next/navigation";

type EditorClientProps = {
  product: {
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
};

export default function EditorClient({ product }: EditorClientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const isDrawing = useRef(false);
  const selectedShapeRef = useRef<string | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isRestoringHistory = useRef(false);

  const isInitialized = useRef(false);
  const isEditingRef = useRef(false);

  const searchParams = useSearchParams();

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontWeight: "",
    fontFamily: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const [currentView, setCurrentView] = useState<View>("front");

  const [designs, setDesigns] = useState<Record<View, string | null>>({
    front: null,
    back: null,
    "left-sleeve": null,
    "right-sleeve": null,
  });

  const preSelectedSize = searchParams.get("size") ?? "";
  const preSelectedColor = searchParams.get("color") ?? "";

  const selectedVariant =
    product.variants.find(
      (v) => v.size === preSelectedSize && v.color === preSelectedColor,
    ) ?? null;

  const handleActiveElement = (el: ActiveElement) => {
    setActiveElement(el);

    if (
      ["rectangle", "circle", "line", "freeform", "text", "triangle"].includes(
        el.value as string,
      )
    ) {
      selectedShapeRef.current = el.value as string;

      if (fabricRef.current) {
        fabricRef.current.isDrawingMode = el.value === "freeform";

        if (el.value === "freeform") {
          if (!fabricRef.current.freeDrawingBrush) {
            fabricRef.current.freeDrawingBrush = new fabric.PencilBrush(
              fabricRef.current,
            );
          }

          fabricRef.current.freeDrawingBrush.width = 5;
          fabricRef.current.freeDrawingBrush.color = "#ffffff";
        }
      }

      return;
    }

    if (el.value === "reset") {
      fabricRef.current?.clear();
      setActiveElement(defaultNavElement);
      return;
    }

    if (el.value === "delete") {
      handleDelete(fabricRef.current!);
      setActiveElement(defaultNavElement);
      return;
    }

    if (el.value === "image") {
      imageInputRef.current?.click();
      isDrawing.current = false;

      if (fabricRef.current) {
        fabricRef.current.isDrawingMode = false;
      }
    }
  };

  const handleUndo = () => {
    if (!fabricRef.current) return;

    undo({
      canvas: fabricRef.current,
      undoStackRef,
      redoStackRef,
      isRestoringHistory,
    });
  };

  const handleRedo = () => {
    if (!fabricRef.current) return;

    redo({
      canvas: fabricRef.current,
      undoStackRef,
      redoStackRef,
      isRestoringHistory,
    });
  };

  const handleViewSwitch = async (view: View) => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    const currentCanvasState = canvas.toJSON();
    console.log(currentCanvasState);

    setDesigns((prev) => ({
      ...prev,
      [currentView]: JSON.stringify(currentCanvasState),
    }));

    undoStackRef.current = [];
    redoStackRef.current = [];

    setCurrentView(view);

    canvas.clear();

    const newDesign = designs[view];

    if (newDesign) {
      canvas.loadFromJSON(newDesign, () => {
        canvas.renderAll();
      });
    } else {
      canvas.renderAll();
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = initializeCanvas({
      canvasRef,
      fabricRef,
      undoStackRef,
      redoStackRef,
    });

    canvas.on("mouse:down", (options) => {
      handleMouseDown({
        options,
        canvas,
        shapeRef,
        isDrawing,
        selectedShapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleMouseMove({
        options,
        canvas,
        shapeRef,
        isDrawing,
        selectedShapeRef,
      });
    });

    canvas.on("mouse:up", () => {
      handleMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        setActiveElement,
        undoStackRef,
        redoStackRef,
        isRestoringHistory,
      });
    });

    canvas.on("selection:created", (options: any) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    const syncHistory = () => {
      saveHistory({
        canvas,
        undoStackRef,
        redoStackRef,
        isRestoringHistory,
      });
    };

    canvas.on("object:added", syncHistory);
    canvas.on("object:modified", syncHistory);
    canvas.on("object:removed", syncHistory);

    const onResize = () => {
      handleResize({ canvas });
    };

    window.addEventListener("resize", onResize);

    isInitialized.current = true;

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.dispose();
    };
  }, []);

  // Load background image
  useEffect(() => {
    if (!fabricRef.current || !isInitialized.current) return;

    const canvas = fabricRef.current;

    const loadBackgroundImage = async () => {
      const productImage =
        product.images.find(
          (img) =>
            img.place === currentView && img.color === selectedVariant?.color,
        )?.url ||
        product.images.find((img) => img.place === currentView)?.url ||
        product.images[0]?.url;

      if (!productImage) return;

      const img = await fabric.Image.fromURL(productImage, {
        crossOrigin: "anonymous",
      });

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      img.scaleToWidth(canvasWidth);
      img.scaleToHeight(canvasHeight);

      img.set({
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        selectable: false,
        evented: false,
      });

      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    };

    loadBackgroundImage();
  }, [product, currentView, selectedVariant]);

  return (
    <>
      {/* Variant indicator */}
      <div className="absolute top-4 left-4 z-50 bg-white px-3 py-1 rounded shadow text-sm">
        {selectedVariant?.size} / {selectedVariant?.color}
      </div>

      <EditorNav
        activeElement={activeElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef.current,
            undoStackRef,
            redoStackRef,
            isRestoringHistory,
          });
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        handleActiveElement={handleActiveElement}
      />

      <section className="h-full flex flex-row">
        <div className="flex flex-col flex-5">
          <ViewTabs
            currentView={currentView}
            handleViewSwitch={handleViewSwitch}
          />

          <CanvasContainer
            canvasRef={canvasRef}
            product={product}
            designs={designs}
            setDesigns={setDesigns}
            fabricRef={fabricRef}
            currentView={currentView}
          />
        </div>

        <RightBar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          undoStackRef={undoStackRef}
          redoStackRef={redoStackRef}
          isRestoringHistory={isRestoringHistory}
          product={product}
          selectedVariant={selectedVariant}
          designs={designs}
          currentView={currentView}
        />
      </section>
    </>
  );
}
