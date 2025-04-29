import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { DataTravelType } from "../../../types/types";

const { TextArea } = Input;
const { Option } = Select;

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  textUz: string;
  textRu: string;
  textEn: string;
  travelId: string;
  file: RcFile[];
};

interface AddAttractionsProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddAttractions: React.FC<AddAttractionsProps> = ({
  onCancel,
  refetch,
}) => {
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
    url: "/attractions",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Diqqatga sazovor joy muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Diqqatga sazovor joy mavjud");
      }else{
        toast.error("Diqqatga sazovor joy qo'shishda xatolik yuz berdi");
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
    formData.append("textUz", data.textUz);
    formData.append("textRu", data.textRu);
    formData.append("textEn", data.textEn);
    formData.append("travelId", data.travelId);
    if (data.file && data.file[0]) {
      formData.append("image", data.file[0]);
    }
    mutate(formData);
    reset();
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
          rules={{ required: "Sarlavha kiriting (Uz)" }}
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
          rules={{ required: "Sarlavha kiriting (Ru)" }}
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
          rules={{ required: "Sarlavha kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha (En)" />}
        />
      </Form.Item>

      <Form.Item
        label="Matn (Uz)"
        validateStatus={errors.textUz ? "error" : ""}
        help={errors.textUz?.message}
      >
        <Controller
          name="textUz"
          control={control}
          rules={{ required: "Matn kiriting (Uz)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Matn (Uz)" style={{ height: "100px", resize: "none" }} />
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
          rules={{ required: "Matn kiriting (Ru)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Matn (Ru)" style={{ height: "100px", resize: "none" }} />
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
          rules={{ required: "Matn kiriting (En)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Matn (En)" style={{ height: "100px", resize: "none" }} />
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
              {data?.items?.map((opt: DataTravelType) => (
                <Option key={opt?.id} value={opt?.id}>
                  {opt?.titleUz}
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

export default AddAttractions;
