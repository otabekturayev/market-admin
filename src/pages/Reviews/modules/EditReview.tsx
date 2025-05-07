import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { ReviewsType } from "../../../types/types";

const { TextArea } = Input;

type FormValues = {
  userName: string;
  rate: string;
  textUz: string;
  textRu: string;
  textEn: string;
  file: RcFile[];
};

interface EditReviewProps {
  onCancel: () => void;
  data: ReviewsType | undefined;
  refetch: () => void;
}

const EditReview: React.FC<EditReviewProps> = ({ onCancel, data, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      reset({
        textUz: data?.textUz || "",
        textRu: data?.textRu || "",
        textEn: data?.textEn || "",
        userName: data?.userName || "",
        rate: String(data?.rate) || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/reviews/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      toast.success("Izoh muvaffaqiyatli yangilandi");
      reset();
      onCancel();
      refetch();
    },

    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Izoh allaqachon mavjud");
      } else {
        toast.error("Izoh yangilashda xatolik yuz berdi");
      }
    },
  });

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

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("textUz", formData.textUz);
    form.append("textRu", formData.textRu);
    form.append("textEn", formData.textEn);
    form.append("rate", formData.rate);
    form.append("userName", formData.userName);
    if (formData.file && formData.file[0]) {
      form.append("file", formData.file[0]);
    }
    mutate(form);
  };

  const handleCancel = () => {
    reset();
    onCancel();
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

      {/* Fayl */}
      <Form.Item label="Rasm yuklash">
        <Controller
          name="file"
          control={control}
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

      {/* Tugmalar */}
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

export default EditReview;
