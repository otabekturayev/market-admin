import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

type FormValues = {
  userName: string;
  rate: string;
  textUz: string;
  textRu: string;
  textEn: string;
  file: RcFile[];
};

interface AddReviewProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddReview: React.FC<AddReviewProps> = ({ onCancel, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate, isLoading } = useApiMutation({
    url: "/reviews",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Izoh muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday nomli Izoh allaqachon mavjud");
      } else {
        toast.error("Izoh qo'shishda xatolik yuz berdi");
      }
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("textUz", data.textUz);
    formData.append("textRu", data.textRu);
    formData.append("textEn", data.textEn);
    formData.append("rate", data.rate);
    formData.append("userName", data.userName);
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }
    mutate(formData);
    reset();
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/vnd.ms-powerpoint",
    ].includes(file.type);

    if (!isAllowed) {
      toast.error(
        "Faqat .png, .jpeg, .jpg, .webp yoki .ppt fayllarni yuklash mumkin"
      );
    }

    return isAllowed || Upload.LIST_IGNORE;
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="UserName"
        validateStatus={errors.userName ? "error" : ""}
        help={errors.userName?.message}
      >
        <Controller
          name="userName"
          control={control}
          rules={{ required: "UserName kiriting" }}
          render={({ field }) => (
            <Input {...field} placeholder="UserName kiriting" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Reyting"
        validateStatus={errors.rate ? "error" : ""}
        help={errors.rate?.message}
      >
        <Controller
          name="rate"
          control={control}
          rules={{
            required: "Reyting kiriting",
            min: { value: 1, message: "Reyting kamida 1 bo'lishi kerak" },
            max: { value: 5, message: "Reyting 5 dan oshmasligi kerak" },
          }}
          render={({ field }) => (
            <InputNumber
              min={1}
              max={5}
              style={{ width: "100%" }}
              {...field}
              placeholder="Reyting kiriting"
            />
          )}
        />
      </Form.Item>

      {/* Text */}
      <Form.Item
        label="Matn (Uz)"
        validateStatus={errors.textUz ? "error" : ""}
        help={errors.textUz?.message}
      >
        <Controller
          name="textUz"
          control={control}
          rules={{ required: "Matnni kiriting (Uz)" }}
          render={({ field }) => (
            <TextArea
              {...field}
              style={{ height: "100px", resize: "none" }}
              placeholder="Matn kiriting (Uz)"
              rows={4}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Matn (Ru)"
        validateStatus={errors.textRu ? "error" : ""}
        help={errors.textRu?.message}
      >
        <Controller
          name="textRu"
          control={control}
          rules={{ required: "Matnni kiriting (Ru)" }}
          render={({ field }) => (
            <TextArea
              {...field}
              style={{ height: "100px", resize: "none" }}
              placeholder="Matn kiriting (Ru)"
              rows={4}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Matn (En)"
        validateStatus={errors.textEn ? "error" : ""}
        help={errors.textEn?.message}
      >
        <Controller
          name="textEn"
          control={control}
          rules={{ required: "Matnni kiriting (En)" }}
          render={({ field }) => (
            <TextArea
              {...field}
              style={{ height: "100px", resize: "none" }}
              placeholder="Matn kiriting (En)"
              rows={4}
            />
          )}
        />
      </Form.Item>

      {/* File Upload */}
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

      {/* Action Buttons */}
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

export default AddReview;
