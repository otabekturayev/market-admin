import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

type FormValues = {
  name: string;
  email: string;
  about: string;
  file?: RcFile[];
};

interface EditTravelDesignerProps {
  onCancel: () => void;
  refetch: () => void;
  data: any;
}

const EditTravelDesigner: React.FC<EditTravelDesignerProps> = ({
  onCancel,
  refetch,
  data,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: data?.name,
      email: data?.email,
      about: data?.about,
    },
  });

  const { mutate, isLoading } = useApiMutation({
    url: `/travel-designers/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Sayohat dizayneri muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday email lik sayohat dizayneri mavjud");
      } else {
        toast.error("Sayohat dizayneri yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("about", data.about);
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    mutate(formData);
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowed = [
      "image/png",
      "image/webp",
      "application/vnd.ms-powerpoint",
    ].includes(file.type);
    if (!isAllowed) {
      toast.error("Faqat .png, .webp yoki .ppt fayllarni yuklash mumkin");
    }
    return isAllowed || Upload.LIST_IGNORE;
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Ism"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Ismni kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Ismingiz" />}
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
            required: "Email kiriting",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "To‘g‘ri email kiriting",
            },
          }}
          render={({ field }) => <Input {...field} placeholder="Email" />}
        />
      </Form.Item>

      <Form.Item
        label="Haqingizda"
        validateStatus={errors.about ? "error" : ""}
        help={errors.about?.message}
      >
        <Controller
          name="about"
          control={control}
          rules={{ required: "Maʼlumot kiriting" }}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={4}
              placeholder="O'zingiz haqida"
              style={{ resize: "none", height: "100px" }}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Rasm yuklash">
        <Controller
          name="file"
          control={control}
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
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
                showDownloadIcon: false,
              }}
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

export default EditTravelDesigner;
