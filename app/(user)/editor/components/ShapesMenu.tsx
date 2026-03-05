"use client";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
  isActive,
}: ShapesMenuProps) => {
  let isDropdownElem = false;
  if (Array.isArray(item.value)) {
    isDropdownElem = item.value.some(
      (elem) => elem?.value === activeElement.value,
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            className={`relative py-4 px-3 cursor-pointer object-contain ${
              isActive(item.value) ? "bg-sky-500" : "bg-gray-800"
            } ${
              isActive(item.value) ? "hover:bg-sky-500" : "hover:bg-gray-700"
            }`}
            onClick={() => handleActiveElement(item)}
          >
            <Image
              src={isDropdownElem ? activeElement.icon : item.icon}
              alt={item.name}
              width={20}
              height={20}
              className={isDropdownElem ? "invert" : ""}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-5 flex flex-col gap-y-1 border-none bg-gray-800 py-4 text-card-foreground">
          {Array.isArray(item.value) &&
            item.value.map((elem) => (
              <Button
                key={elem?.name}
                onClick={() => {
                  handleActiveElement(elem);
                }}
                className={`flex h-fit justify-between cursor-pointer gap-10 rounded-none px-5 bg-gray-800 hover:bg-gray-700 py-3 focus:border-none ${
                  activeElement.value === elem?.value &&
                  "bg-sky-500 hover:bg-sky-500"
                }`}
              >
                <div className="group flex items-center gap-2">
                  <Image
                    src={elem?.icon as string}
                    alt={elem?.name as string}
                    width={20}
                    height={20}
                    className={
                      activeElement.value === elem?.value ? "invert" : ""
                    }
                  />
                  <p className={`text-sm  text-gray-100`}>{elem?.name}</p>
                </div>
              </Button>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;
