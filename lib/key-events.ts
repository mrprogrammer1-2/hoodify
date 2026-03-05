import * as fabric from "fabric";
export const handleDelete = (canvas: fabric.Canvas) => {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  if (activeObject.type === "activeSelection") {
    const selection = activeObject as fabric.ActiveSelection;

    selection.forEachObject((obj) => {
      canvas.remove(obj);
    });
  } else {
    canvas.remove(activeObject);
  }

  canvas.discardActiveObject(); // Fabric may still think something is selected Especially after multi-select deletion
  canvas.requestRenderAll();
};
