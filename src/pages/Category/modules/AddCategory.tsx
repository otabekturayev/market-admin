import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
};

interface AddCategoryProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  onCancel,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate, isLoading } = useApiMutation({
    url: "/category",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Kategoriya muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday categoriya allaqachon mavjud mavjud");
      }else{
        toast.error("Kategoriya qo'shishda xatolik yuz berdi");
      }
      
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    mutate(data);
    reset()
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
          rules={{ required: "Sarlavhani kiriting (Uz)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha kiriting (Uz)" />}
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
          rules={{ required: "Sarlavhani kiriting (Ru)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha kiriting (Ru)" />}
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
          rules={{ required: "Sarlavhani kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha kiriting (En)" />}
        />
      </Form.Item>

      <Form.Item
        label="Tavsiv (Uz)"
        validateStatus={errors.descriptionUz ? "error" : ""}
        help={errors.descriptionUz?.message}
      >
        <Controller
          name="descriptionUz"
          control={control}
          rules={{ required: "Tavsif kiriting (Uz)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Tavsif kiriting (Uz)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Tavsiv (Ru)"
        validateStatus={errors.descriptionRu ? "error" : ""}
        help={errors.descriptionRu?.message}
      >
        <Controller
          name="descriptionRu"
          control={control}
          rules={{ required: "Tavsif kiriting (Ru)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Tavsif kiriting (Ru)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Tavsiv (En)"
        validateStatus={errors.descriptionEn ? "error" : ""}
        help={errors.descriptionEn?.message}
      >
        <Controller
          name="descriptionEn"
          control={control}
          rules={{ required: "Tavsif kiriting (En)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Tavsif kiriting (En)"  style={{ resize: 'none', height: '100px' }}/>
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

export default AddCategory;
