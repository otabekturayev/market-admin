import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { ArticlesType } from "../../../types/types";

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  textUz: string;
  textRu: string;
  textEn: string;
  images: RcFile[] | string[];
  aboutImages: RcFile[] | string[];
  articleId: string;
};

interface EditSubArticlesProps {
  onCancel: () => void;
  refetch: () => void;
  data: any;
}

const EditSubArticles: React.FC<EditSubArticlesProps> = ({
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

  const { data: articles } = useFetch<ArticlesType>({
    key: ["articles"],
    url: "/articles",
  });

  const { mutate, isLoading } = useApiMutation({
    url: `/subarticles/update/${data.id}`,
    method: "PATCH",
    onSuccess: () => {
      toast.success("Kichkina maqola muvaffaqiyatli yangilandi");
      refetch();
      onCancel();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Kichkina maqola allaqachon mavjud");
      } else {
        toast.error("Kichkina maqola yangilashda xatolik yuz berdi");
      }
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        titleUz: data.titleUz,
        titleRu: data.titleRu,
        titleEn: data.titleEn,
        textUz: data.textUz,
        textRu: data.textRu,
        textEn: data.textEn,
        articleId: data.articleId,
        images: data.images ? [data.images as any] : [],
        aboutImages: data.aboutImages ? [data.aboutImages as any] : [],
      });
    }
  }, [data, reset]);

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
    formData.append("articleId", data.articleId);

    // Agar yangi rasm yuklangan bo'lsa, uni yuboramiz
    if (data.images && data.images[0] && typeof data.images[0] !== "string") {
      formData.append("images", data.images[0]);
    }

    if (
      data.aboutImages &&
      data.aboutImages[0] &&
      typeof data.aboutImages[0] !== "string"
    ) {
      formData.append("aboutImage", data.aboutImages[0]);
    }

    mutate(formData);
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
      {/* Title */}
      <Form.Item
        label="Sarlavha (Uz)"
        validateStatus={errors.titleUz ? "error" : ""}
        help={errors.titleUz?.message}
      >
        <Controller
          name="titleUz"
          control={control}
          rules={{ required: "Sarlavhani kiriting (Uz)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Uz)" />
          )}
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
          rules={{ required: "Sarlavhani kiriting (Ru)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (Ru)" />
          )}
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
          render={({ field }) => (
            <Input {...field} placeholder="Sarlavha (En)" />
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
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Matn"
              rows={5}
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
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Matn"
              rows={5}
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
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Matn"
              rows={5}
            />
          )}
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
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="images"
              accept=".png,.webp,.ppt,.jpg,.jpeg"
              beforeUpload={(file) => {
                const isValid = beforeUpload(file);
                if (isValid !== Upload.LIST_IGNORE) {
                  onChange([file]);
                }
                return false;
              }}
              fileList={
                value?.map((file: any, index: number) =>
                  typeof file === "string"
                    ? {
                        uid: `${index}`,
                        name: file.split("/").pop(),
                        status: "done",
                        url: file,
                      }
                    : file
                ) || []
              }
              onRemove={() => onChange([])}
              multiple={false}
              maxCount={1}
              onPreview={(file) => {
                if (file.url) window.open(file.url, "_blank");
              }}
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
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="aboutImages"
              accept=".png,.webp,.ppt,.jpg,.jpeg"
              beforeUpload={(file) => {
                const isValid = beforeUpload(file);
                if (isValid !== Upload.LIST_IGNORE) {
                  onChange([file]);
                }
                return false;
              }}
              fileList={
                value?.map((file: any, index: number) =>
                  typeof file === "string"
                    ? {
                        uid: `${index}`,
                        name: file.split("/").pop(),
                        status: "done",
                        url: file,
                      }
                    : file
                ) || []
              }
              onRemove={() => onChange([])}
              multiple={false}
              maxCount={1}
              onPreview={(file) => {
                if (file.url) window.open(file.url, "_blank");
              }}
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
          rules={{ required: "Maqola ID tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Maqolani tanlang">
              {articles?.items?.map((article: ArticlesType) => (
                <Select.Option key={article?.id} value={article?.id}>
                  {article?.titleUz}
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
          Yangilash
        </Button>
      </div>
    </Form>
  );
};

export default EditSubArticles;
