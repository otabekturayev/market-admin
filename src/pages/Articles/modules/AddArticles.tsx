import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  file: RcFile[];
};

interface AddArticlesDesignerProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddArticles: React.FC<AddArticlesDesignerProps> = ({
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
    url: "/articles",
    method: "POST",
    onSuccess: () => {
        reset();
      toast.success("Maqola muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Maqola allaqachon mavjud");
      }else{
        toast.error("Maqola qo'shishda xatolik yuz berdi");
      }
      
    },
  });

  const handleCancel = () => {
      reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("titleUz", data.titleUz);
    formData.append("titleRu", data.titleRu);
    formData.append("titleEn", data.titleEn);
    if (data.file && data.file[0]) {
      formData.append("images", data.file[0]);
    }
    mutate(formData);
    reset()
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowed = ["image/png", "image/webp", "application/vnd.ms-powerpoint"].includes(file.type);
    if (!isAllowed) {
      toast.error("Faqat .png, .webp yoki .ppt fayllarni yuklash mumkin");
    }
    return isAllowed || Upload.LIST_IGNORE;
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
          rules={{ required: "Sarlavhani kiriting (Uzbek)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (Uz)" />}
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
          rules={{ required: "Sarlavhani kiriting (Ruscha)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (Ru)" />}
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
          rules={{ required: "Sarlavhani kiriting (Inglizcha)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (En)" />}
        />
      </Form.Item>

      <Form.Item
        label="Rasm yuklash"
        validateStatus={errors.file ? "error" : ""}
        help={errors.file?.message}
      >
        <Controller
          name="file"
          control={control}
          rules={{ required: "Rasm yuklang" }}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="file"
              accept=".png,.webp,.ppt"
              beforeUpload={(file) => {
                const isValid = beforeUpload(file);
                if (isValid !== Upload.LIST_IGNORE) {
                  onChange([file]);
                }
                return false;
              }}
              fileList={value || []}
              onRemove={() => onChange([])}
              multiple={false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Faylni bu yerga tashlang yoki yuklash uchun bosing
              </p>
              <p className="ant-upload-hint">
                Faqat .png, .webp va .ppt fayllar qabul qilinadi
              </p>
            </Upload.Dragger>
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

export default AddArticles;
