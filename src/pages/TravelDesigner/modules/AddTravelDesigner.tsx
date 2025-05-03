import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

type FormValues = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  email: string;
  aboutUz: string;
  aboutRu: string;
  aboutEn: string;
  file: RcFile[];
};

interface AddTravelDesignerProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddTravelDesigner: React.FC<AddTravelDesignerProps> = ({
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
    url: "/travel-designers",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Sayohat dizayneri muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday email lik sayohat dizayneri mavjud");
      }else{
        toast.error("Sayohat dizayneri qo'shishda xatolik yuz berdi");
      }
      
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("nameUz", data.nameUz);
    formData.append("nameRu", data.nameRu);
    formData.append("nameEn", data.nameEn);
    formData.append("email", data.email);
    formData.append("aboutUz", data.aboutUz);
    formData.append("aboutRu", data.aboutRu);
    formData.append("aboutEn", data.aboutEn);
    if (data.file && data.file[0]) {
      formData.append("image", data.file[0]);
    }

    mutate(formData);
    reset()
  };

  const beforeUpload = (file: RcFile) => {
        const isAllowed = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
          "application/vnd.ms-powerpoint"
        ].includes(file.type);
      
        if (!isAllowed) {
          toast.error("Faqat .png, .jpeg, .jpg, .webp yoki .ppt fayllarni yuklash mumkin");
        }
      
        return isAllowed || Upload.LIST_IGNORE;
      };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Ism (Uz)"
        validateStatus={errors.nameUz ? "error" : ""}
        help={errors.nameUz?.message}
      >
        <Controller
          name="nameUz"
          control={control}
          rules={{ required: "Ismni kiriting (Uz)" }}
          render={({ field }) => <Input {...field} placeholder="Ismini kiriting (Uz)" />}
        />
      </Form.Item>
      <Form.Item
        label="Ism (Ru)"
        validateStatus={errors.nameRu ? "error" : ""}
        help={errors.nameRu?.message}
      >
        <Controller
          name="nameRu"
          control={control}
          rules={{ required: "Ismni kiriting (Ru)" }}
          render={({ field }) => <Input {...field} placeholder="Ismini kiriting (Ru)" />}
        />
      </Form.Item>
      <Form.Item
        label="Ism (En)"
        validateStatus={errors.nameEn ? "error" : ""}
        help={errors.nameEn?.message}
      >
        <Controller
          name="nameEn"
          control={control}
          rules={{ required: "Ismni kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Ismini kiriting (En)" />}
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
        label="Haqingizda (Uz)"
        validateStatus={errors.aboutUz ? "error" : ""}
        help={errors.aboutUz?.message}
      >
        <Controller
          name="aboutUz"
          control={control}
          rules={{ required: "Maʼlumot kiriting (Uz)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Maʼlumot kiriting (Uz)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Haqingizda (Ru)"
        validateStatus={errors.aboutRu ? "error" : ""}
        help={errors.aboutRu?.message}
      >
        <Controller
          name="aboutRu"
          control={control}
          rules={{ required: "Maʼlumot kiriting (Ru)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Maʼlumot kiriting (Ru)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Haqingizda (En)"
        validateStatus={errors.aboutEn ? "error" : ""}
        help={errors.aboutEn?.message}
      >
        <Controller
          name="aboutEn"
          control={control}
          rules={{ required: "Maʼlumot kiriting (En)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Maʼlumot kiriting (En)"  style={{ resize: 'none', height: '100px' }}/>
          )}
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
          rules={{ required: 'Rasm yuklang' }}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="file"
              accept=".png,.webp,.ppt,.jpg,.jpeg"
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

export default AddTravelDesigner;
