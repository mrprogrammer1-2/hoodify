"use client";
import { useEffect, useRef, useState } from "react";
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
  const [layers, setLayers] = useState<fabric.Object[]>([]);

  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const isRestoringHistory = useRef(false);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  const isEditingRef = useRef(false);

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

    // 1️⃣ Save current canvas state properly
    const currentCanvasState = canvas.toJSON();

    setDesigns((prev) => ({
      ...prev,
      [currentView]: JSON.stringify(currentCanvasState),
    }));

    // 2️⃣ Clear undo/redo stacks per view (VERY IMPORTANT)
    undoStackRef.current = [];
    redoStackRef.current = [];

    // 3️⃣ Switch view
    setCurrentView(view);

    // 4️⃣ Clear canvas
    canvas.clear();

    // 5️⃣ Load new view design if exists
    const newDesign = designs[view];

    if (newDesign) {
      canvas.loadFromJSON(newDesign, () => {
        canvas.renderAll();
      });
    } else {
      canvas.renderAll();
    }
  };

  // Initialize canvas once
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

    const syncLayers = () => {
      setLayers([...canvas.getObjects()]);

      saveHistory({
        canvas,
        undoStackRef,
        redoStackRef,
        isRestoringHistory,
      });
    };

    canvas.on("object:added", syncLayers);
    canvas.on("object:modified", syncLayers);
    canvas.on("object:removed", syncLayers);

    // canvas.on("object:added", autoSave);
    // canvas.on("object:modified", autoSave);
    // canvas.on("object:removed", autoSave);
    // canvas.on("path:created", autoSave);

    const onResize = () => {
      handleResize({ canvas });
    };

    window.addEventListener("resize", onResize);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        handleUndo();
      }

      if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    isInitialized.current = true;

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []);

  // Load initial background image (only once)
  useEffect(() => {
    if (!fabricRef.current || !product || !isInitialized.current) return;

    const canvas = fabricRef.current;
    const loadBackgroundImage = async () => {
      const productImage =
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
  }, [product, currentView]);

  // Handle view switching
  useEffect(() => {
    if (!fabricRef.current || !isInitialized.current) return;

    const canvas = fabricRef.current;

    const switchView = async () => {
      // Load background for new view
      const imageForView = product.images.find(
        (img) => img.place === currentView,
      );

      if (imageForView) {
        const img = await fabric.Image.fromURL(imageForView.url, {
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
          isProductImage: true,
        });

        // canvas.add(img);
        canvas.backgroundImage = img;
        // canvas.sendToBack(img);
      }

      // Load saved design for new view
      // const saved = designs[currentView];
      // console.log("saved designs", saved);
      // if (saved) {
      //   try {
      //     const parsed = JSON.parse(saved);

      //     // Use enlivenObjects to recreate fabric objects
      //     if (parsed.objects && parsed.objects.length > 0) {
      //       (fabric.util as any).enlivenObjects(
      //         parsed.objects,
      //         (objects: fabric.Object[]) => {
      //           objects.forEach((obj) => {
      //             canvas.add(obj);
      //           });
      //           canvas.requestRenderAll();
      //         },
      //       );
      //     } else {
      //       canvas.requestRenderAll();
      //     }
      //   } catch (error) {
      //     console.error("Error loading saved design:", error);
      //     canvas.requestRenderAll();
      //   }
      // } else {
      //   canvas.requestRenderAll();
      // }
    };

    switchView();
  }, [currentView]);

  return (
    <>
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
        />
      </section>
    </>
  );
}
