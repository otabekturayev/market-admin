import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  file: RcFile[];
};

interface AddsubTravelIdeasProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddSubTRavelIdeas: React.FC<AddsubTravelIdeasProps> = ({
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
    url: "/sub-travel-ideas",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Sayohat g'oyasi muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday nomli Sayohat g'oyasi mavjud");
      }else{
        toast.error("Sayohat g'oyasi qo'shishda xatolik yuz berdi");
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
    formData.append("descriptionUz", data.descriptionUz);
    formData.append("descriptionRu", data.descriptionRu);
    formData.append("descriptionEn", data.descriptionEn);
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
        label="Sarlavha (Uz)"
        validateStatus={errors.titleUz ? "error" : ""}
        help={errors.titleUz?.message}
      >
        <Controller
          name="titleUz"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Uz)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavhani kiriting (Uz)" />}
        />
      </Form.Item>
      <Form.Item
        label="Sarlavha(Ru)"
        validateStatus={errors.titleRu ? "error" : ""}
        help={errors.titleRu?.message}
      >
        <Controller
          name="titleRu"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Ru)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavhani kiriting (Ru)" />}
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
          rules={{ required: "Sarlavhani kiriting (En)" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavhani kiriting (En)" />}
        />
      </Form.Item>

      <Form.Item
        label="Tavsif (Uz)"
        validateStatus={errors.descriptionUz ? "error" : ""}
        help={errors.descriptionUz?.message}
      >
        <Controller
          name="descriptionUz"
          control={control}
          rules={{ required: "Maʼlumot kiriting (Uz)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Maʼlumot kiriting (Uz)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Tavsif (Ru)"
        validateStatus={errors.descriptionRu ? "error" : ""}
        help={errors.descriptionRu?.message}
      >
        <Controller
          name="descriptionRu"
          control={control}
          rules={{ required: "Maʼlumot kiriting (Ru)" }}
          render={({ field }) => (
            <TextArea {...field} rows={4} placeholder="Maʼlumot kiriting (Ru)"  style={{ resize: 'none', height: '100px' }}/>
          )}
        />
      </Form.Item>
      <Form.Item
        label="Tavsif (En)"
        validateStatus={errors.descriptionEn ? "error" : ""}
        help={errors.descriptionEn?.message}
      >
        <Controller
          name="descriptionEn"
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

export default AddSubTRavelIdeas;
