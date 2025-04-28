import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

type FormValues = {
  phone: string;
  email: string;
  workTime: string;
};

interface AddOperatorsProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddOperators: React.FC<AddOperatorsProps> = ({ onCancel, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate, isLoading } = useApiMutation({
    url: "/operators",
    method: "POST",
    onSuccess: () => {
        reset();
      toast.success("Operator muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error("Bunday nomli operator allaqachon mavjud");
      } else {
        toast.error("Operator qo'shishda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
    reset()
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

export default AddOperators;
