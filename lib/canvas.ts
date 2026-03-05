import * as fabric from "fabric";
import { createSpecificShape } from "./shapes";
import { defaultNavElement } from "@/constants";
import jsPDF from "jspdf";

export const initializeCanvas = ({
  canvasRef,
  fabricRef,
  undoStackRef,
  redoStackRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  undoStackRef: React.MutableRefObject<string[]>;
  redoStackRef: React.MutableRefObject<string[]>;
}) => {
  console.log("Canvas initialized");
  const canvasContainer = document.getElementById("canvas");

  if (!canvasRef.current) throw new Error("canvas ref not fount");

  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasContainer?.clientWidth || 800,
    height: canvasContainer?.clientHeight || 600,
    backgroundColor: "transparent",
    selection: true,
  });

  fabricRef.current = canvas;

  undoStackRef.current = [JSON.stringify([])];
  redoStackRef.current = [];

  return canvas;
};

// ─── MULTI-SURFACE SWITCH ────────────────────────────────────────────────────
//
// Call this instead of setCurrentView when the user clicks a surface tab.
// It saves the current surface state, swaps the background, and restores
// the new surface's objects and undo/redo history automatically.

export const switchSurface = async ({
  canvas,
  newSurface,
  newBackgroundUrl,
  activeSurfaceRef,
  surfaceStatesRef,
  surfaceHistoryRef,
  undoStackRef,
  redoStackRef,
}: {
  canvas: fabric.Canvas | null;
  newSurface: string;
  newBackgroundUrl: string;
  activeSurfaceRef: React.MutableRefObject<string>;
  surfaceStatesRef: React.MutableRefObject<Record<string, string>>;
  surfaceHistoryRef: React.MutableRefObject<
    Record<string, { undo: string[]; redo: string[] }>
  >;
  undoStackRef: React.MutableRefObject<string[]>;
  redoStackRef: React.MutableRefObject<string[]>;
}) => {
  if (!canvas) return;

  const currentSurface = activeSurfaceRef.current;

  // 1. Save current surface objects
  surfaceStatesRef.current[currentSurface] = JSON.stringify(
    canvas.toObject().objects,
  );

  // 2. Save current surface undo/redo stacks
  surfaceHistoryRef.current[currentSurface] = {
    undo: [...undoStackRef.current],
    redo: [...redoStackRef.current],
  };

  // 3. Clear canvas
  canvas.clear();

  // 4. Set new background image
  const img = await fabric.Image.fromURL(newBackgroundUrl);
  img.scaleToWidth(canvas.getWidth());
  canvas.backgroundImage = img;

  // 5. Restore saved objects for the new surface
  const savedObjects = surfaceStatesRef.current[newSurface];
  const parsed = JSON.parse(savedObjects);
  const objects = Array.isArray(parsed) ? parsed : (parsed.objects ?? []);

  if (objects.length > 0) {
    const revived = await fabric.util.enlivenObjects(objects);
    revived.forEach((obj) => canvas.add(obj as fabric.Object));
  }

  // 6. Restore undo/redo stacks for the new surface
  const { undo, redo } = surfaceHistoryRef.current[newSurface];
  undoStackRef.current = undo;
  redoStackRef.current = redo;

  // 7. Mark the new surface as active
  activeSurfaceRef.current = newSurface;

  canvas.renderAll();
};
// ─────────────────────────────────────────────────────────────────────────────

const enableSelection = (canvas: fabric.Canvas) => {
  canvas.selection = true;
  canvas.forEachObject((obj) => {
    obj.selectable = true;
    obj.evented = true;
  });
};

const disableSelection = (canvas: fabric.Canvas) => {
  canvas.selection = false;
  canvas.discardActiveObject();
  canvas.forEachObject((obj) => {
    obj.selectable = false;
    obj.evented = false;
  });
};

export const handleMouseDown = ({
  options,
  canvas,
  shapeRef,
  isDrawing,
  selectedShapeRef,
}: mouseDownType) => {
  const pointer = canvas.getScenePoint(options.e);
  const target = options.target ?? canvas.findTarget(options.e, false);

  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "#000000";
    return;
  }

  canvas.isDrawingMode = false;

  if (target && target instanceof fabric.Object) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
  } else {
    isDrawing.current = true;
    disableSelection(canvas);
    shapeRef.current = createSpecificShape(selectedShapeRef.current!, pointer);
    if (shapeRef.current) {
      shapeRef.current.set({
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
      });
      canvas.add(shapeRef.current);
    }
  }
};

export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement || !canvas) return;
  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

export const handleMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
}: CanvasMouseMove) => {
  if (!isDrawing.current || !shapeRef.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;
  const pointer = canvas.getScenePoint(options.e);

  switch (selectedShapeRef.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    case "circle":
      shapeRef.current?.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;
    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    case "line":
      shapeRef.current?.set({ x2: pointer.x, y2: pointer.y });
      break;
    case "text":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;
    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
    default:
      break;
  }

  canvas.renderAll();
};

export const handleMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  selectedShapeRef,
  setActiveElement,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  if (!canvas) return;

  if (selectedShapeRef.current === "freeform") {
    canvas.isDrawingMode = false;
    enableSelection(canvas);
    canvas.renderAll();
    saveHistory({ canvas, undoStackRef, redoStackRef, isRestoringHistory });
    selectedShapeRef.current = null;
    setTimeout(() => setActiveElement(defaultNavElement), 0);
    return;
  }

  enableSelection(canvas);

  if (shapeRef.current) {
    shapeRef.current.set({
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
    });
    canvas.setActiveObject(shapeRef.current);
  }

  shapeRef.current = null;
  selectedShapeRef.current = null;
  setTimeout(() => setActiveElement(defaultNavElement), 0);
  canvas.renderAll();
  saveHistory({ canvas, undoStackRef, redoStackRef, isRestoringHistory });
};

export const saveHistory = ({
  canvas,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: Props & { isRestoringHistory: React.MutableRefObject<boolean> }) => {
  if (!canvas || isRestoringHistory.current) return;

  const json = JSON.stringify(canvas.toObject().objects);
  const last = undoStackRef.current.at(-1);
  // console.log(json);
  if (json === last) return;

  undoStackRef.current.push(json);
  redoStackRef.current.length = 0;

  if (undoStackRef.current.length > 50) {
    undoStackRef.current.shift();
  }
  console.log(undoStackRef.current);
};

export const undo = ({
  canvas,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: Props & { isRestoringHistory: React.MutableRefObject<boolean> }) => {
  if (!canvas || undoStackRef.current.length < 2) return;

  isRestoringHistory.current = true;

  const current = undoStackRef.current.pop()!;
  redoStackRef.current.push(current);

  const previous = undoStackRef.current.at(-1)!;
  const parsed = JSON.parse(previous);
  const objects = Array.isArray(parsed) ? parsed : (parsed.objects ?? []);

  const bg = canvas.backgroundImage;
  canvas.clear();
  if (bg) canvas.backgroundImage = bg;

  fabric.util.enlivenObjects(objects).then((revived) => {
    revived.forEach((obj) => canvas.add(obj as fabric.Object));
    canvas.renderAll();
    isRestoringHistory.current = false;
  });
};

type Props = {
  canvas: fabric.Canvas | null;
  undoStackRef: React.MutableRefObject<string[]>;
  redoStackRef: React.MutableRefObject<string[]>;
};

export const redo = ({
  canvas,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: Props & { isRestoringHistory: React.MutableRefObject<boolean> }) => {
  if (!canvas || !redoStackRef.current.length) return;

  isRestoringHistory.current = true;

  const next = redoStackRef.current.pop()!;
  undoStackRef.current.push(next);

  const parsed = JSON.parse(next);
  const objects = Array.isArray(parsed) ? parsed : (parsed.objects ?? []);

  const bg = canvas.backgroundImage;
  canvas.clear();
  if (bg) canvas.backgroundImage = bg;

  fabric.util.enlivenObjects(objects).then((revived) => {
    revived.forEach((obj) => canvas.add(obj as fabric.Object));
    canvas.renderAll();
    isRestoringHistory.current = false;
  });
};

export const handleImageUpload = ({
  canvas,
  file,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: {
  canvas: fabric.Canvas | null;
  file: File;
  undoStackRef: React.MutableRefObject<string[]>;
  redoStackRef: React.MutableRefObject<string[]>;
  isRestoringHistory: React.MutableRefObject<boolean>;
}) => {
  if (!canvas) return;

  const reader = new FileReader();
  reader.onload = async () => {
    if (!canvas) return;
    const img = await fabric.Image.fromURL(reader.result as string);
    if (!img) return;

    img.set({
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
    });

    img.scaleToWidth(200);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    saveHistory({ canvas, undoStackRef, redoStackRef, isRestoringHistory });
  };

  reader.readAsDataURL(file);
};

export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  if (isEditingRef.current) return;

  const selected = options?.selected;
  if (!selected || selected.length !== 1) return;

  const obj = selected[0];
  if (!obj) return;

  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();
  const isText =
    obj.type === "textbox" || obj.type === "text" || obj.type === "i-text";

  setElementAttributes({
    width: Math.round(width).toString(),
    height: Math.round(height).toString(),
    fill: typeof obj.fill === "string" ? obj.fill : "",
    stroke: typeof obj.stroke === "string" ? obj.stroke : "",
    fontSize: isText && "fontSize" in obj ? (obj.fontSize ?? "") : "",
    fontFamily: isText && "fontFamily" in obj ? (obj.fontFamily ?? "") : "",
    fontWeight: isText && "fontWeight" in obj ? (obj.fontWeight ?? "") : "",
  });
};

export const exportToPdf = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  const data = canvas.toDataURL();
  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);
  doc.save("canvas.pdf");
};
