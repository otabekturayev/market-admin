import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { OperatorsType } from "../../../types/types";

type FormValues = {
  phone: string;
  email: string;
  workTime: string;
};

interface EditOperatorsProps {
  onCancel: () => void;
  data: OperatorsType | undefined;
  refetch: () => void;
}

const EditOperators: React.FC<EditOperatorsProps> = ({ onCancel, data, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      reset({
        phone: data.phone || "",
        email: data.email || "",
        workTime: data.workTime || "",
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/operators/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
        reset();
      toast.success("Operator muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error("Bunday nomli operator allaqachon mavjud");
      } else {
        toast.error("Operatorni yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (formData: FormValues) => {
    mutate(formData);
  };

  const handleCancel = () => {
      reset();
    onCancel();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Telefon raqam"
        validateStatus={errors.phone ? "error" : ""}
        help={errors.phone?.message}
      >
        <Controller
          name="phone"
          control={control}
          rules={{ required: "Telefon raqamni kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="+998 xx xxx xx xx" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Emailni kiriting",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "To'g'ri email kiriting",
            },
          }}
          render={({ field }) => <Input {...field} placeholder="Email" />}
        />
      </Form.Item>

      <Form.Item
        label="Ish vaqti"
        validateStatus={errors.workTime ? "error" : ""}
        help={errors.workTime?.message}
      >
        <Controller
          name="workTime"
          control={control}
          rules={{ required: "Ish vaqtini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Masalan: 09:00 - 18:00" />
          )}
        />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button type="primary" danger onClick={handleCancel}>
          Bekor qilish
        </Button>
        <Button loading={isLoading} type="primary" htmlType="submit">
          Yuborish
        </Button>
      </div>
    </Form>
  );
};

export default EditOperators;
