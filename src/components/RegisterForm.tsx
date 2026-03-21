import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FormField } from "./FormField";
import { Input } from "./Input";

// Schema
const schema = z
  .object({
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[a-z]/, "Lowercase required")
      .regex(/[A-Z]/, "Uppercase required")
      .regex(/[0-9]/, "Number required")
      .regex(/[^a-zA-Z0-9]/, "Special character required"),
    repeatPassword: z.string(),
  })
  .refine((d) => d.password === d.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });

  const rules = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(console.log)}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-lg"
      >
        <h2 className="text-2xl font-semibold">Create account</h2>

        {/* Email */}
        <FormField label="Email" error={errors.email?.message}>
          <Input
            placeholder="Email"
            {...register("email")}
            error={!!errors.email}
          />
        </FormField>

        {/* Password */}
        <FormField label="Password">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")} 
          />

          {/* Rules */}
          <div className="grid grid-cols-2 gap-1 text-xs mt-2">
            <Rule ok={rules.lowercase} label="Lowercase" />
            <Rule ok={rules.uppercase} label="Uppercase" />
            <Rule ok={rules.number} label="Number" />
            <Rule ok={rules.special} label="Special char" />
          </div>
        </FormField>

        {/* Repeat Password */}
        <FormField
          label="Repeat password"
          error={errors.repeatPassword?.message}
        >
          <Input
            type="password"
            placeholder="Repeat password"
            {...register("repeatPassword")}
            error={!!errors.repeatPassword}
          />
        </FormField>

        <button
          disabled={!isValid}
          className={`w-full rounded-xl py-2 text-sm font-medium text-white transition ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}

// Rule component
function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 ${
        ok ? "text-green-600" : "text-gray-400"
      }`}
    >
      <span>{ok ? "✓" : "•"}</span>
      <span>{label}</span>
    </div>
  );
}