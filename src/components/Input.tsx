import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    const base =
      "w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2";

    const styles = error
      ? "border-red-500 focus:ring-red-400"
      : "border-gray-300 focus:ring-blue-400";

    return (
      <input
        ref={ref}
        {...props}
        className={`${base} ${styles} ${className}`}
      />
    );
  }
);

Input.displayName = "Input";