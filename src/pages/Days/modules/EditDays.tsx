import React, { useEffect } from "react";
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

interface EditDaysProps {
  onCancel: () => void;
  data: any;
  refetch: () => void;
}

const EditDays: React.FC<EditDaysProps> = ({ onCancel, data, refetch }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: travels } = useFetch<DataTravelType>({
    key: ["travels"],
    url: "/travels",
  });

  useEffect(() => {
    if (data) {
      reset({
        nameUz: data?.titleUz || "",
        nameRu: data?.titleRu || "",
        nameEn: data?.titleEn || "",
        destinationUz: data?.destinationUz || "",
        destinationRu: data?.destinationRu || "",
        destinationEn: data?.destinationEn || "",
        textUz: data?.textUz || "",
        textRu: data?.textRu || "",
        textEn: data?.textEn || "",
        travelId: data?.travelId || "",
        latitude: data?.lat || "",
        longitude: data?.long || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/days/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      toast.success("Kun muvaffaqiyatli yangilandi");
      reset();
      onCancel();
      refetch();
    },

    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Kun allaqachon mavjud");
      } else {
        toast.error("Kun yangilashda xatolik yuz berdi");
      }
    },
  });

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

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("titleUz", formData.nameUz);
    form.append("titleRu", formData.nameRu);
    form.append("titleEn", formData.nameEn);
    form.append("destinationUz", formData.destinationUz);
    form.append("destinationRu", formData.destinationRu);
    form.append("destinationEn", formData.destinationEn);
    form.append("textUz", formData.textUz);
    form.append("textRu", formData.textRu);
    form.append("textEn", formData.textEn);
    form.append("travelId", formData.travelId);
    form.append("lat", formData.latitude);
    form.append("long", formData.longitude);
    if (formData.file && formData.file[0]) {
      form.append("image", formData.file[0]);
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
        label="Sarlavha (Uz)"
        validateStatus={errors.nameUz ? "error" : ""}
        help={errors.nameUz?.message}
      >
        <Controller
          name="nameUz"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Uz)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Uz)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Ru)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (En)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Viloyat (Uz)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Viloyat (Ru)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Viloyat (En)" />
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

      {/* Travel tanlash */}
      <Form.Item
        label="Sayohatni tanlang"
        validateStatus={errors.travelId ? "error" : ""}
        help={errors.travelId?.message}
      >
        <Controller
          name="travelId"
          control={control}
          rules={{ required: "Sayohat turini tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohatni tanlang">
              {travels?.items?.map((opt: TravelType) => (
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

      {/* Fayl */}
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

export default EditDays;
