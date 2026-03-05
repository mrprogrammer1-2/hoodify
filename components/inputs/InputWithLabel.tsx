"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

type Props<s> = {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputWithLabel<s>({
  name,
  label,
  placeholder,
  className,
  ...rest
}: Props<s>) {
  const form = useFormContext(); // to refrence the form

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base" htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              placeholder={placeholder}
              className={`w-full disabled:text-blue-500 dark:disabled:text-green-500 disabled:opacity-75 ${className}`}
              {...field}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
