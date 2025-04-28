import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";

const { TextArea } = Input;
const { Option } = Select;

type FormValues = {
  title: string;
  text: string;
  travelId: string;
  file: RcFile[];
};

interface EditAttractionsProps {
  onCancel: () => void;
  refetch: () => void;
  data: any;
}

const EditAttractions: React.FC<EditAttractionsProps> = ({
  onCancel,
  refetch,
  data,
}) => {
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
        title: data?.title || "",
        text: data?.text || "",
        travelId: data?.travel?.id || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/attractions/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Diqqatga sazovor joy muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Diqqatga sazovor joy mavjud");
      } else {
        toast.error("Diqqatga sazovor joy yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("text", formData.text);
    form.append("travelId", formData.travelId);
    if (formData.file && formData.file.length > 0) {
      form.append("image", formData.file[0]);
    }
    mutate(form);
  };

  const handleCancel = () => {
    reset();
    onCancel();
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
      <Form.Item
        label="Sarlavha"
        validateStatus={errors.title ? "error" : ""}
        help={errors.title?.message}
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Sarlavha kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha" />}
        />
      </Form.Item>

      <Form.Item
        label="Matn"
        validateStatus={errors.text ? "error" : ""}
        help={errors.text?.message}
      >
        <Controller
          name="text"
          control={control}
          rules={{ required: "Matn kiriting" }}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={4}
              placeholder="Matn"
              style={{ height: "100px", resize: "none" }}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Sayohatni tanlang"
        validateStatus={errors.travelId ? "error" : ""}
        help={errors.travelId?.message}
      >
        <Controller
          name="travelId"
          control={control}
          rules={{ required: "Sayohat tanlang" }}
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

      <Form.Item
        label="Rasm yuklash"
        validateStatus={errors.file ? "error" : ""}
        help={errors.file?.message}
      >
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

export default EditAttractions;
