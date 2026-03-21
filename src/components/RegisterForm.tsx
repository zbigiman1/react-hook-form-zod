import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FormField } from "./FormField";
import { Input } from "./Input";

  const passwordRulesConstant = {
    lowercase: { regex: /[a-z]/, message: "Lowercase required" },
    uppercase: { regex: /[A-Z]/, message: "Uppercase required" },
    number: { regex: /[0-9]/, message: "Number required" },
    special: { regex: /[^a-zA-Z0-9]/, message: "Special character required" },
  };

// Schema
const schema = z
  .object({
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(passwordRulesConstant.lowercase.regex, passwordRulesConstant.lowercase.message)
      .regex(passwordRulesConstant.uppercase.regex, passwordRulesConstant.uppercase.message)
      .regex(passwordRulesConstant.number.regex, passwordRulesConstant.number.message)
      .regex(passwordRulesConstant.special.regex, passwordRulesConstant.special.message),
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
    mode: "onTouched",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });

  const passwordRules = {
    lowercase: passwordRulesConstant.lowercase.regex.test(password),
    uppercase: passwordRulesConstant.uppercase.regex.test(password),
    number: passwordRulesConstant.number.regex.test(password),
    special: passwordRulesConstant.special.regex.test(password),
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
            <Rule ok={passwordRules.lowercase} label="Lowercase" />
            <Rule ok={passwordRules.uppercase} label="Uppercase" />
            <Rule ok={passwordRules.number} label="Number" />
            <Rule ok={passwordRules.special} label="Special char" />
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
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
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