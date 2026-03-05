"use client";

import { saveHistory } from "@/lib/canvas";
import Dimensions from "./settings/Dimensions";
import Text from "./settings/Text";
import Color from "./settings/Color";
import { useRef } from "react";
import Export from "./settings/Export";

export default function RightBar({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
}: RightSidebarProps) {
  const inputRef = useRef(null);
  const strokeRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    const activeObject = fabricRef.current?.getActiveObject();
    if (!activeObject) return;

    if (property === "width") {
      activeObject.set("width", parseInt(value));
      activeObject.set("scaleX", 1);
    } else if (property === "height") {
      activeObject.set("height", parseInt(value));
      activeObject.set("scaleY", 1);
    } else {
      if (activeObject[property as keyof object] === value) return;
      activeObject.set(property as keyof object, value);
    }

    activeObject.setCoords();
    fabricRef.current?.requestRenderAll();
    saveHistory({
      canvas: fabricRef.current!,
      undoStackRef,
      redoStackRef,
      isRestoringHistory,
    });
  };

  return (
    <div className="flex flex-1 flex-col border-t border-border bg-card text-foreground flex-2 sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="px-5 pt-4 text-xs uppercase">Design</h3>
      <span className="text-xs mt-3 px-5 pb-4  border-b border-gray-800">
        Make changes as you like.
      </span>

      <Dimensions
        width={elementAttributes.width}
        height={elementAttributes.height}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
      <Text
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        fontFamily={elementAttributes.fontFamily}
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={inputRef}
        attribute={elementAttributes.fill}
        placeholder="color"
        attributeType="fill"
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={strokeRef}
        attribute={elementAttributes.stroke}
        placeholder="stroke"
        attributeType="stroke"
        handleInputChange={handleInputChange}
      />
      <Export />
    </div>
  );
}
