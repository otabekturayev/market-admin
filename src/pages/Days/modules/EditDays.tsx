import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";

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

  const { data: travels } = useFetch<any>({
    key: ["travels"],
    url: "/travels",
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data?.title || "",
        destination: data?.destination || "",
        text: data?.text || "",
        travelId: data?.travelId || "",
        latitude: data?.lat || "",
        longitude: data?.long || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/days/update/${data.id}`,
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
    const isAllowed = ["image/png", "image/webp", "application/vnd.ms-powerpoint"].includes(file.type);
    if (!isAllowed) {
      toast.error("Faqat .png, .webp yoki .ppt fayllarni yuklash mumkin");
    }
    return isAllowed || Upload.LIST_IGNORE;
  };

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("title", formData.name);
    form.append("destination", formData.destination);
    form.append("text", formData.text);
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
      {/* Sarlavha */}
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

      {/* Matn */}
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
              {travels?.data?.data?.map((opt: any) => (
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
