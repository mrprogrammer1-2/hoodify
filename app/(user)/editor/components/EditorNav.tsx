import { navElements } from "@/constants";
import { Button } from "@/components/ui/button";
import ShapesMenu from "./ShapesMenu";

import Image from "next/image";

export default function EditorNav({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
  onUndo,
  onRedo,
}: NavbarProps) {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  const handleClick = (item: ActiveElement) => {
    if (!item) return;

    if (item.value === "undo") {
      onUndo();
      return;
    }

    if (item.value === "redo") {
      onRedo();
      return;
    }

    handleActiveElement(item);
  };

  return (
    <header className="w-full h-12 bg-card shadow-md">
      <nav className="px-4 py-2 flex flex-row items-center gap-4 justify-between">
        <ul className="flex gap-2">
          {navElements.map((item: ActiveElement) => (
            <li key={item.name}>
              {Array.isArray(item.value) ? (
                <ShapesMenu
                  item={item}
                  activeElement={activeElement}
                  handleActiveElement={handleActiveElement}
                  handleImageUpload={handleImageUpload}
                  imageInputRef={imageInputRef}
                  isActive={isActive}
                />
              ) : (
                <Button
                  className={`relative py-4 px- object-contain cursor-pointer ${
                    isActive(item.value) ? "bg-sky-500" : "bg-gray-800"
                  } ${
                    isActive(item.value)
                      ? "hover:bg-sky-500"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleClick(item)}
                  title={item.title && item.title}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                  />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
