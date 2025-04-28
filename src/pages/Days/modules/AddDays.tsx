import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { DataTravelType, TravelType } from "../../../types/types";

const { TextArea } = Input;
const { Option } = Select;

type FormValues = {
  name: string;
  destination: string;
  text: string;
  travelId: string;
  latitude: string;
  longitude: string;
  file: RcFile[];
};

interface AddDaysProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddDays: React.FC<AddDaysProps> = ({ onCancel, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data } = useFetch<DataTravelType>({
    key: ["travels"],
    url: "/travels",
  });

  const { mutate, isLoading } = useApiMutation({
    url: "/days",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Kun muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday nomli Kun allaqachon mavjud");
      } else {
        toast.error("Kun qo'shishda xatolik yuz berdi");
      }
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("destination", data.destination);
    formData.append("text", data.text);
    formData.append("travelId", data.travelId);
    formData.append("lat", data.latitude);
    formData.append("long", data.longitude);
    if (data.file && data.file[0]) {
      formData.append("image", data.file[0]);
    }
    mutate(formData);
    reset();
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

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {/* Name */}
      <Form.Item
        label="Sarlavha"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: "Sarlavhani kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha" />}
        />
      </Form.Item>

      {/* Destination */}
      <Form.Item
        label="Viloyat"
        validateStatus={errors.destination ? "error" : ""}
        help={errors.destination?.message}
      >
        <Controller
          name="destination"
          control={control}
          rules={{ required: "Viloyatni kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Viloyat" />}
        />
      </Form.Item>

      {/* Text */}
      <Form.Item
        label="Matn"
        validateStatus={errors.text ? "error" : ""}
        help={errors.text?.message}
      >
        <Controller
          name="text"
          control={control}
          rules={{ required: "Matnni kiriting" }}
          render={({ field }) => (
            <TextArea {...field} placeholder="Matn kiriting" rows={4} />
          )}
        />
      </Form.Item>

      {/* Travel ID */}
      <Form.Item
        label="Sayohatni tanlang"
        validateStatus={errors.travelId ? "error" : ""}
        help={errors.travelId?.message}
      >
        <Controller
          name="travelId"
          control={control}
          rules={{ required: "Sayohatni tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohatni tanlang">
              {data?.items?.map((opt: TravelType) => (
                <Option key={opt?.id} value={opt?.id}>
                  {opt?.title}
                </Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      {/* Latitude */}
      <Form.Item
        label="Latitude"
        validateStatus={errors.latitude ? "error" : ""}
        help={errors.latitude?.message}
      >
        <Controller
          name="latitude"
          control={control}
          rules={{ required: "Latitude kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Latitude" />}
        />
      </Form.Item>

      {/* Longitude */}
      <Form.Item
        label="Longitude"
        validateStatus={errors.longitude ? "error" : ""}
        help={errors.longitude?.message}
      >
        <Controller
          name="longitude"
          control={control}
          rules={{ required: "Longitude kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Longitude" />}
        />
      </Form.Item>

      {/* File Upload */}
      <Form.Item
        label="Rasm yoki fayl yuklash"
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

export default AddDays;
