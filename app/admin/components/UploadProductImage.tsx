"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onUpload: (url: string) => void;
};

export default function UploadProductImage({ onUpload }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="hoodify"
      onSuccess={(result: any) => {
        const url = result.info.secure_url;
        onUpload(url);
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 border rounded-md"
          >
            Upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
