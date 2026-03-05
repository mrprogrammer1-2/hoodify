import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

export const createRectangle = (pointer: fabric.Point) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#3b82f6",
    stroke: "#1e40af",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: fabric.Point) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#10b981",
    stroke: "#059669",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: fabric.Point) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 50,
    fill: "#f59e0b",
    stroke: "#d97706",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Circle>);
};

export const createLine = (pointer: fabric.Point) => {
  const line = new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#ef4444",
      strokeWidth: 3,
    },
  ) as CustomFabricObject<fabric.Line>;

  line.objectId = uuidv4();

  return line;
};

export const createText = (pointer: fabric.Point) => {
  const text = new fabric.Textbox("Text", {
    left: pointer.x,
    top: pointer.y,
    width: 250,
    fontSize: 28,
    fill: "#000000",
    fontFamily: "Arial",
  }) as CustomFabricObject<fabric.Textbox>;

  text.objectId = uuidv4();

  return text;
};

export const createSpecificShape = (
  shapeType: string,
  pointer: fabric.Point,
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);
    case "triangle":
      return createTriangle(pointer);
    case "circle":
      return createCircle(pointer);
    case "line":
      return createLine(pointer);
    case "text":
      return createText(pointer);

    default:
      return null;
  }
};
