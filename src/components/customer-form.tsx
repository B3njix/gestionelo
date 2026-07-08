import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const customerSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().or(z.literal("")),
  ciudad: z.string().optional().or(z.literal("")),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

type CustomerFormProps = {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function CustomerForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Guardar",
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { nombre: "", email: "", telefono: "", ciudad: "", ...defaultValues },
  });

  useEffect(() => {
    reset({ nombre: "", email: "", telefono: "", ciudad: "", ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" placeholder="Nombre del cliente" {...register("nombre")} />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="correo@ejemplo.com" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" placeholder="+503 6000-0000" {...register("telefono")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciudad">Ciudad</Label>
        <Input id="ciudad" placeholder="San Salvador" {...register("ciudad")} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          style={{ background: "var(--gradient-primary)" }}
        >
          {isLoading ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
