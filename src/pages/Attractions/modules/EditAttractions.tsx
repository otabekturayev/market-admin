import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { AttractionsDataType, DataTravelType } from "../../../types/types";

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

interface EditAttractionsProps {
  onCancel: () => void;
  refetch: () => void;
  data: AttractionsDataType | undefined;
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



  const { data: travels } = useFetch<DataTravelType>({
    key: ["travels"],
    url: "/travels",
  });

  useEffect(() => {
    if (data) {
      reset({
        titleUz: data?.titleUz || "",
        titleRu: data?.titleRu || "",
        titleEn: data?.titleEn || "",
        textUz: data?.textUz || "",
        textRu: data?.textRu || "",
        textEn: data?.textEn || "",
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
    form.append("titleUz", formData.titleUz);
    form.append("titleRu", formData.titleRu);
    form.append("titleEn", formData.titleEn);
    form.append("textUz", formData.textUz);
    form.append("textRu", formData.textRu);
    form.append("textEn", formData.textEn);
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
              {travels?.items?.map((opt: DataTravelType) => (
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
          Yangilash
        </Button>
      </div>
    </Form>
  );
};

export default EditAttractions;
