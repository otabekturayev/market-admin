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
  nameUz: string;
  nameRu: string;
  nameEn: string;
  destinationUz: string;
  destinationRu: string;
  destinationEn: string;
  textUz: string;
  textRu: string;
  textEn: string;
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
    formData.append("titleUz", data.nameUz);
    formData.append("titleRu", data.nameRu);
    formData.append("titleEn", data.nameEn);
    formData.append("destinationUz", data.destinationUz);
    formData.append("destinationRu", data.destinationRu);
    formData.append("destinationEn", data.destinationEn);
    formData.append("textUz", data.textUz);
    formData.append("textRu", data.textRu);
    formData.append("textEn", data.textEn);
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
        label="Sarlavha (Uz)"
        validateStatus={errors.nameUz ? "error" : ""}
        help={errors.nameUz?.message}
      >
        <Controller
          name="nameUz"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Uz)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (Uz)" />}
        />
      </Form.Item>

      <Form.Item
        label="Sarlavha (Ru)"
        validateStatus={errors.nameRu ? "error" : ""}
        help={errors.nameRu?.message}
      >
        <Controller
          name="nameRu"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Ru)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (Ru)" />}
        />
      </Form.Item>

      <Form.Item
        label="Sarlavha (En)"
        validateStatus={errors.nameEn ? "error" : ""}
        help={errors.nameEn?.message}
      >
        <Controller
          name="nameEn"
          control={control}
          rules={{ required: "Sarlavhani kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (En)" />}
        />
      </Form.Item>

      {/* Destination */}
      <Form.Item
        label="Viloyat (Uz)"
        validateStatus={errors.destinationUz ? "error" : ""}
        help={errors.destinationUz?.message}
      >
        <Controller
          name="destinationUz"
          control={control}
          rules={{ required: "Viloyatni kiriting (Uz)" }}
          render={({ field }) => <Input {...field} placeholder="Viloyat (Uz)" />}
        />
      </Form.Item>

      <Form.Item
        label="Viloyat (Ru)"
        validateStatus={errors.destinationRu ? "error" : ""}
        help={errors.destinationRu?.message}
      >
        <Controller
          name="destinationRu"
          control={control}
          rules={{ required: "Viloyatni kiriting (Ru)" }}
          render={({ field }) => <Input {...field} placeholder="Viloyat (Ru)" />}
        />
      </Form.Item>

      <Form.Item
        label="Viloyat (En)"
        validateStatus={errors.destinationEn ? "error" : ""}
        help={errors.destinationEn?.message}
      >
        <Controller
          name="destinationEn"
          control={control}
          rules={{ required: "Viloyatni kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Viloyat (En)" />}
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
                  {opt?.titleUz}
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
