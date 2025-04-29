import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

type FormValues = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
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
        label="Daraja (UZ)"
        validateStatus={errors.nameUz ? "error" : ""}
        help={errors.nameUz?.message}
      >
        <Controller
          name="nameUz"
          control={control}
          rules={{ required: "O'zbekcha nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani o'zbekcha nomi" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Daraja (RU)"
        validateStatus={errors.nameRu ? "error" : ""}
        help={errors.nameRu?.message}
      >
        <Controller
          name="nameRu"
          control={control}
          rules={{ required: "Ruscha nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani ruscha nomi" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Daraja (EN)"
        validateStatus={errors.nameEn ? "error" : ""}
        help={errors.nameEn?.message}
      >
        <Controller
          name="nameEn"
          control={control}
          rules={{ required: "Inglizcha nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani inglizcha nomi" />
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

export default AddLevel;
