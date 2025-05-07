import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { ExprensType, TRavelIdeasType, TravelTypesType } from "../../../types/types";
import { useFetch } from "../../../hooks/useFetch";

type FormValues = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descreptionUz: string;
  descreptionRu: string;
  descreptionEn: string;
  tourTitleUz: string;
  tourTitleRu: string;
  tourTitleEn: string;
  travelIdeaId: string;
  file: RcFile[];
  exprensId: string
};

interface EditTravelTypesProps {
  onCancel: () => void;
  data: TravelTypesType | undefined;
  refetch: () => void;
}

const EditTravelTypes: React.FC<EditTravelTypesProps> = ({
  onCancel,
  data,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: travelIdeaData } = useFetch<TRavelIdeasType>({
      key: ["travel-ideas"],
      url: "/travel-ideas",
    });

    const { data: exprens } = useFetch<ExprensType>({
        key: ["exprens"],
        url: "/exprens",
      });

  useEffect(() => {
    if (data) {
      reset({
        nameUz: data?.titleUz || "",
        nameRu: data?.titleRu || "",
        nameEn: data?.titleEn || "",
        descreptionEn: data?.descreptionEn || "",
        descreptionRu: data?.descreptionRu || "",
        descreptionUz: data?.descreptionUz || "",
        tourTitleUz: data?.tourTitleUz || "",
        tourTitleRu: data?.tourTitleRu || "",
        tourTitleEn: data?.tourTitleEn || "",
        travelIdeaId: data?.travelIdeaId || "",
        exprensId: data?.exprensId || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/travel-types/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Sayohat turi muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Sayohat turi allaqachon mavjud");
      } else {
        toast.error("Sayohat turi yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("titleUz", formData.nameUz);
    form.append("titleRu", formData.nameRu);
    form.append("titleEn", formData.nameEn);
    form.append("descreptionEn", formData.descreptionEn);
    form.append("descreptionRu", formData.descreptionRu);
    form.append("descreptionUz", formData.descreptionUz);
    form.append("tourTitleEn", formData.tourTitleEn);
    form.append("tourTitleRu", formData.tourTitleRu);
    form.append("tourTitleUz", formData.tourTitleUz);
    form.append("travelIdeaId", formData.travelIdeaId);
    form.append("exprensId", formData.exprensId)
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
      "application/vnd.ms-powerpoint",
    ].includes(file.type);

    if (!isAllowed) {
      toast.error(
        "Faqat .png, .jpeg, .jpg, .webp yoki .ppt fayllarni yuklash mumkin"
      );
    }

    return isAllowed || Upload.LIST_IGNORE;
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
      <Form.Item
        label="Sayohat sarlavhasi (Uz)"
        validateStatus={errors.tourTitleUz ? "error" : ""}
        help={errors.tourTitleUz?.message}
      >
        <Controller
          name="tourTitleUz"
          control={control}
          rules={{ required: "Sayohat sarlavhasini kiriting (Uz)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sayohat sarlavhasi (Uz)" />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Saayohat srlavhasi (Ru)"
        validateStatus={errors.tourTitleRu ? "error" : ""}
        help={errors.tourTitleRu?.message}
      >
        <Controller
          name="tourTitleRu"
          control={control}
          rules={{ required: "Sayohat sarlavhasini kiriting (Ru)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sayohat sarlavhasi (Ru)" />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Sayohat sarlavhasi (En)"
        validateStatus={errors.tourTitleEn ? "error" : ""}
        help={errors.tourTitleEn?.message}
      >
        <Controller
          name="tourTitleEn"
          control={control}
          rules={{ required: "Sayohat sarlavhasini kiriting (En)" }}
          render={({ field }) => (
            <Input {...field} placeholder="Sayohat sarlavhasi (En)" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Tavsif (Uz)"
        validateStatus={errors.descreptionUz ? "error" : ""}
        help={errors.descreptionUz?.message}
      >
        <Controller
          name="descreptionUz"
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
        validateStatus={errors.descreptionRu ? "error" : ""}
        help={errors.descreptionRu?.message}
      >
        <Controller
          name="descreptionRu"
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
        validateStatus={errors.descreptionEn ? "error" : ""}
        help={errors.descreptionEn?.message}
      >
        <Controller
          name="descreptionEn"
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

      <Form.Item
        label="Sayohat g'oyasi"
        validateStatus={errors.travelIdeaId ? "error" : ""}
        help={errors.travelIdeaId?.message}
      >
        <Controller
          name="travelIdeaId"
          control={control}
          rules={{ required: "Sayohat g'oyasi tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohat g'oyasi tanlang">
              {/* Bu yerga dynamic ravishda maqolalar keladi. Hozircha statik variant qo'yildi */}
              {travelIdeaData?.items?.map((article: TRavelIdeasType) => (
                <Select.Option key={article?.id} value={article?.id}>
                  {article?.titleUz}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
              label="Sayohatdagi ta'surot"
              validateStatus={errors.exprensId ? "error" : ""}
              help={errors.exprensId?.message}
            >
              <Controller
                name="exprensId"
                control={control}
                rules={{ required: "Sayohatdagi ta'surotni tanlang" }}
                render={({ field }) => (
                  <Select {...field} placeholder="Sayohatdagi ta'surotni tanlang">
                    {/* Bu yerga dynamic ravishda maqolalar keladi. Hozircha statik variant qo'yildi */}
                    {exprens?.items?.map((exprens: ExprensType) => (
                      <Select.Option key={exprens?.id} value={exprens?.id}>
                        {exprens?.titleUz}
                      </Select.Option>
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

export default EditTravelTypes;
