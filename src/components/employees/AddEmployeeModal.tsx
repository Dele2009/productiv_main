"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageCircleWarning, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { AddEmployeeSchema, addEmployeeSchema } from "@/lib/validations/schema";
import { useRouter } from "next/navigation";

export function AddEmployeeModal({
  onCreated,
}: {
  onCreated?: (data: any) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEmployeeSchema>({
    resolver: yupResolver(addEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (data: AddEmployeeSchema) => {
    try {
      const res = await axios.post("/api/organization/employees", data, {
        withCredentials: true,
      });
      toast.success("Employee added successfully");
      onCreated?.(res.data);
      setOpen(false);
      reset();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Something went wrong", {
        icon: <MessageCircleWarning />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={isSubmitting}
        staticBackdrop={isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              disabled={isSubmitting}
              {...register("name")}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              disabled={isSubmitting}
              {...register("email")}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Employees
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
