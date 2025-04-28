import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

type FormValues = {
  name: string;
};

interface EditLevelProps {
  onCancel: () => void;
  data: any;
  refetch: () => void;
}

const EditLevel: React.FC<EditLevelProps> = ({ onCancel, data, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/levels/update/${data.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Daraja muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bundan nomli Daraja mavjud");
      } else {
        toast.error("Darajani yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
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
          rules={{ required: "Darajani nomini kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="Darajani nomi" />
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

export default EditLevel;
