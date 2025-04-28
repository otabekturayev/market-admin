import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";

const { Option } = Select;

type FormValues = {
  title: string;
  levelId: string;
};

interface AddServicesProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddServices: React.FC<AddServicesProps> = ({ onCancel, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data } = useFetch<any>({
    key: ["levels"],
    url: "/levels",
  });

  const { mutate, isLoading } = useApiMutation({
    url: "/services",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Xizmat muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Xizmat mavjud");
      } else {
        toast.error("Xizmatni qo'shishda xatolik yuz berdi");
      }
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    mutate(data);
    reset();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Sarlavha"
        validateStatus={errors.title ? "error" : ""}
        help={errors.title?.message}
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Sarlavha kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha" />}
        />
      </Form.Item>

      <Form.Item
        label="Darajani tanlang"
        validateStatus={errors.levelId ? "error" : ""}
        help={errors.levelId?.message}
      >
        <Controller
          name="levelId"
          control={control}
          rules={{ required: "Daraja tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Darajani tanlang">
              {data?.data?.data?.map((opt: any) => (
                <Option key={opt.id} value={opt.id}>
                  {opt.name}
                </Option>
              ))}
            </Select>
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

export default AddServices;
