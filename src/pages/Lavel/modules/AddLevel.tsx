import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

type FormValues = {
  name: string
};

interface AddLevelProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddLevel: React.FC<AddLevelProps> = ({ onCancel, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate, isLoading } = useApiMutation({
    url: "/levels",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Daraja muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli daraja mavjud");
      } else {
        toast.error("Daraja qo'shishda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Daraja"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Darajaning nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani nomi" />
          )}
        />
      </Form.Item>

      {/* <Form.Item
        label="Daraja (EN)"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Darajaning nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani inglizcha nomi" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Daraja (DE)"
        validateStatus={errors.name?.de ? "error" : ""}
        help={errors.name?.de?.message}
      >
        <Controller
          name="name.de"
          control={control}
          rules={{ required: "Darajaning nemischa nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani nemischa nomi" />
          )}
        />
      </Form.Item> */}

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

export default AddLevel;
