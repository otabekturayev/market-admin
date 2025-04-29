import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { DataServicesType, LevelsType } from "../../../types/types";

const { Option } = Select;

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  levelId: string;
};

interface EditServicesProps {
  onCancel: () => void;
  data: DataServicesType | undefined;
  refetch: () => void;
}

const EditServices: React.FC<EditServicesProps> = ({
  onCancel,
  data,
  refetch,
}) => {
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
        titleUz: data.titleUz || "",
        titleRu: data.titleRu || "",
        titleEn: data.titleEn || "",
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
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Xizmat mavjud");
      } else {
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
        label="Sarlavha (Uz)"
        validateStatus={errors.titleUz ? "error" : ""}
        help={errors.titleUz?.message}
      >
        <Controller
          name="titleUz"
          control={control}
          rules={{ required: "Sarlavha kiriting (Uz)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Uz)" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Sarlavha (Ru)"
        validateStatus={errors.titleRu ? "error" : ""}
        help={errors.titleRu?.message}
      >
        <Controller
          name="titleRu"
          control={control}
          rules={{ required: "Sarlavha kiriting (Ru)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Ru)" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Sarlavha (En)"
        validateStatus={errors.titleEn ? "error" : ""}
        help={errors.titleEn?.message}
      >
        <Controller
          name="titleEn"
          control={control}
          rules={{ required: "Sarlavha kiriting (En)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (En)" />
          )}
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
                  {opt.nameUz}
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
