import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { DataServicesType, LevelsType } from "../../../types/types";

const { Option } = Select;

type FormValues = {
  title: string;
  levelId: string;
};

interface EditServicesProps {
  onCancel: () => void;
  data: DataServicesType | undefined;
  refetch: () => void;
}

const EditServices: React.FC<EditServicesProps> = ({ onCancel, data, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: levels } = useFetch<LevelsType>({
    key: ["levels"],
    url: "/levels",
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        levelId: data.levels?.[0]?.id || "",
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/services/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
        reset();
      toast.success("Xizmat muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if(error?.response?.status === 409) {
        toast.error("Bunday nomli Xizmat mavjud");
      }else{
        toast.error("Xizmatni yangilashda xatolik yuz berdi");
      }
      
    },
  });

  const handleCancel = () => {
      reset();
    onCancel();
  };

  const onSubmit = (formData: FormValues) => {
    mutate(formData);
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
              {levels?.items?.map((opt: LevelsType) => (
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
          Yangilash
        </Button>
      </div>
    </Form>
  );
};

export default EditServices;
