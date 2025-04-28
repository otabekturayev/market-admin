import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { ArticlesType } from "../../../types/types";

type FormValues = {
  title: string;
  text: string;
  images: RcFile[];
  aboutImages: RcFile[];
  articleId: string;
};

interface AddSubArticlesProps {
  onCancel: () => void;
  refetch: () => void;
}

const AddSubArticles: React.FC<AddSubArticlesProps> = ({
  onCancel,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data, } = useFetch<ArticlesType>({
      key: ['articles'],
      url: '/articles',
    });

  const { mutate, isLoading } = useApiMutation({
    url: "/subarticles",
    method: "POST",
    onSuccess: () => {
      reset();
      toast.success("Kichkina maqola muvaffaqiyatli qo'shildi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error("Bunday nomli Kichkina maqola allaqachon mavjud");
      } else {
        toast.error("Kichkina maqola qo'shishda xatolik yuz berdi");
      }
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("articleId", data.articleId);

    if (data.images && data.images[0]) {
      formData.append("images", data.images[0]);
    }
    if (data.aboutImages && data.aboutImages[0]) {
      formData.append("aboutImage", data.aboutImages[0]);
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
      {/* Title */}
      <Form.Item
        label="Sarlavha"
        validateStatus={errors.title ? "error" : ""}
        help={errors.title?.message}
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Sarlavhani kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha" />}
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
          render={({ field }) => <Input.TextArea style={{ height: "100px", resize: "none" }} {...field} placeholder="Matn" rows={5} />}
        />
      </Form.Item>

      {/* Images */}
      <Form.Item
        label="Asosiy rasm yuklash"
        validateStatus={errors.images ? "error" : ""}
        help={errors.images?.message}
      >
        <Controller
          name="images"
          control={control}
          rules={{ required: "Asosiy rasm yuklang" }}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="images"
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

      {/* About Images */}
      <Form.Item
        label="Qo'shimcha rasm yuklash"
        validateStatus={errors.aboutImages ? "error" : ""}
        help={errors.aboutImages?.message}
      >
        <Controller
          name="aboutImages"
          control={control}
          rules={{ required: "Qo'shimcha rasmni yuklang" }}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="aboutImages"
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

      {/* Article ID */}
      <Form.Item
        label="Maqola"
        validateStatus={errors.articleId ? "error" : ""}
        help={errors.articleId?.message}
      >
        <Controller
          name="articleId"
          control={control}
          rules={{ required: "Maqola tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Maqolani tanlang">
              {/* Bu yerga dynamic ravishda maqolalar keladi. Hozircha statik variant qo'yildi */}
              {data?.items?.map((article: ArticlesType) => (
                <Select.Option key={article?.id} value={article?.id}>
                  {article?.title}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      {/* Submit and Cancel buttons */}
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

export default AddSubArticles;
