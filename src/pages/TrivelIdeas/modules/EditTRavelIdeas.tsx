import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { SubTrivelIdeasType, TRavelIdeasType } from "../../../types/types";

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  subTitleUz: string;
  subTitleRu: string;
  subTitleEn: string;
  subDescriptionUz: string;
  subDescriptionRu: string;
  subDescriptionEn: string;
  image: RcFile[];
  subImage: RcFile[];
  subTravelIdeasId: string;
};

interface EditSubArticlesProps {
  onCancel: () => void;
  refetch: () => void;
  data: TRavelIdeasType | undefined;
}

const EditTRavelIdeas: React.FC<EditSubArticlesProps> = ({
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

  const { data: subTravelIdeas } = useFetch<SubTrivelIdeasType>({
    key: ["sub-travel-ideas"],
    url: "/sub-travel-ideas",
  });

  const { mutate, isLoading } = useApiMutation({
    url: `/travel-ideas/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      toast.success("Sayohat g'oyasi muvaffaqiyatli yangilandi");
      refetch();
      onCancel();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Sayohat g'oyasi allaqachon mavjud");
      } else {
        toast.error("Sayohat g'oyasi yangilashda xatolik yuz berdi");
      }
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        titleUz: data.titleUz,
        titleRu: data.titleRu,
        titleEn: data.titleEn,
        descriptionUz: data.descriptionUz,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn,
        subTitleUz: data.subTitleUz,
        subTitleRu: data.subTitleRu,
        subTitleEn: data.subTitleEn,
        subDescriptionUz: data.subDescriptionUz,
        subDescriptionRu: data.subDescriptionRu,
        subDescriptionEn: data.subDescriptionEn,
        subTravelIdeasId: data.subTravelIdeasId
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
    formData.append("descriptionEn", data.descriptionEn);
    formData.append("descriptionRu", data.descriptionRu);
    formData.append("descriptionUz", data.descriptionUz);
    formData.append("subTitleUz", data.subTitleUz);
    formData.append("subTitleRu", data.subTitleRu);
    formData.append("subTitleEn", data.subTitleEn);
    formData.append("subDescriptionEn", data.subDescriptionEn);
    formData.append("subDescriptionRu", data.subDescriptionRu);
    formData.append("subDescriptionUz", data.subDescriptionUz);
    formData.append("subTravelIdeasId", data.subTravelIdeasId);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.subImage && data.subImage[0]) {
      formData.append("subImage", data.subImage[0]);
    }

    mutate(formData);
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
        validateStatus={errors.titleUz ? "error" : ""}
        help={errors.titleUz?.message}
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
        validateStatus={errors.titleUz ? "error" : ""}
        help={errors.titleUz?.message}
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
        label="Tavsif (Uz)"
        validateStatus={errors.descriptionUz ? "error" : ""}
        help={errors.descriptionUz?.message}
      >
        <Controller
          name="descriptionUz"
          control={control}
          rules={{ required: "Tavsif kiriting (Uz)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Tavsif"
              rows={5}
            />
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
          rules={{ required: "Tavsif kiriting (Ru)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Tavsif"
              rows={5}
            />
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
          rules={{ required: "Tavsif kiriting (En)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Tavsif"
              rows={5}
            />
          )}
        />
      </Form.Item>

      {/* Images */}
      <Form.Item
        label="Asosiy rasm yuklash"
        validateStatus={errors.image ? "error" : ""}
        help={errors.image?.message}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="image"
              accept=".png,.webp,.ppt"
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
      <Form.Item
        label="Qo'shimcha sarlavha (Uz)"
        validateStatus={errors.subTitleUz ? "error" : ""}
        help={errors.subTitleUz?.message}
      >
        <Controller
          name="subTitleUz"
          control={control}
          rules={{ required: "Qo'shimcha sarlavhani kiriting (Uz)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Qo'shimcha sarlavha (Uz)" />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Qo'shimcha sarlavha (Ru)"
        validateStatus={errors.titleRu ? "error" : ""}
        help={errors.titleRu?.message}
      >
        <Controller
          name="subTitleRu"
          control={control}
          rules={{ required: "Qo'shimcha sarlavhani kiriting (Ru)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Qo'shimcha sarlavha (Ru)" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Qo'shimcha sarlavha (En)"
        validateStatus={errors.subTitleEn ? "error" : ""}
        help={errors.subTitleEn?.message}
      >
        <Controller
          name="subTitleEn"
          control={control}
          rules={{ required: "Qo'shimcha sarlavhani kiriting (En)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Qo'shimcha sarlavha (En)" />
          )}
        />
      </Form.Item>

      {/* About Images */}
      <Form.Item
        label="Qo'shimcha rasm yuklash"
        validateStatus={errors.subImage ? "error" : ""}
        help={errors.subImage?.message}
      >
        <Controller
          name="subImage"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              name="subImage"
              accept=".png,.webp,.ppt"
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
      <Form.Item
        label="Qoshimcha tavsif (Uz)"
        validateStatus={errors.subDescriptionUz ? "error" : ""}
        help={errors.subDescriptionUz?.message}
      >
        <Controller
          name="subDescriptionUz"
          control={control}
          rules={{ required: "Qoshimcha tavsif kiriting (Uz)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Qoshimcha tavsif"
              rows={5}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Qoshimcha tavsif (Ru)"
        validateStatus={errors.subDescriptionRu ? "error" : ""}
        help={errors.subDescriptionRu?.message}
      >
        <Controller
          name="subDescriptionRu"
          control={control}
          rules={{ required: "Qoshimcha tavsif kiriting (Ru)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Qoshimcha tavsif"
              rows={5}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Qoshimcha tavsif (En)"
        validateStatus={errors.subDescriptionEn ? "error" : ""}
        help={errors.subDescriptionEn?.message}
      >
        <Controller
          name="subDescriptionEn"
          control={control}
          rules={{ required: "Qoshimcha tavsif kiriting (En)" }}
          render={({ field }) => (
            <Input.TextArea
              style={{ height: "100px", resize: "none" }}
              {...field}
              placeholder="Qoshimcha tavsif"
              rows={5}
            />
          )}
        />
      </Form.Item>

      {/* Article ID */}
      <Form.Item
        label="Sayohat g'oyasi"
        validateStatus={errors.subTravelIdeasId ? "error" : ""}
        help={errors.subTravelIdeasId?.message}
      >
        <Controller
          name="subTravelIdeasId"
          control={control}
          rules={{ required: "Sayohat g'oyasini tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohat g'oyasini tanlang">
              {subTravelIdeas?.items?.map((article: SubTrivelIdeasType) => (
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

export default EditTRavelIdeas;
