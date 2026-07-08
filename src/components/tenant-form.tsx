import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const tenantSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  activo: z.boolean(),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;

type TenantFormProps = {
  defaultValues?: Partial<TenantFormValues>;
  onSubmit: (values: TenantFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function TenantForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Guardar",
}: TenantFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { nombre: "", slug: "", activo: true, ...defaultValues },
  });

  const activo = watch("activo");

  useEffect(() => {
    reset({ nombre: "", slug: "", activo: true, ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la empresa</Label>
        <Input id="nombre" placeholder="Eventos Elegantes S.A." {...register("nombre")} />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="eventos-elegantes" {...register("slug")} />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        <p className="text-xs text-muted-foreground">
          Identificador único en la URL. Solo minúsculas, números y guiones.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Activo</p>
          <p className="text-xs text-muted-foreground">
            El tenant y sus usuarios pueden acceder al sistema
          </p>
        </div>
        <Switch checked={activo} onCheckedChange={(checked) => setValue("activo", checked)} />
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
