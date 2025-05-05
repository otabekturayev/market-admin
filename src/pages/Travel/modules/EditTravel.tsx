import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import {
  DataTravelType,
  LevelsType,
  SubTravelType,
  TravelDesignersType,
  TravelTypesType,
} from "../../../types/types";

const { TextArea } = Input;

type FormValues = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  days: number;
  price: number;
  travelDesignerId: string;
  levelId: string;
  file: RcFile[];
  travelTypeId: string | null | undefined;
  subTravelId: string[];
};

interface EditTravelProps {
  onCancel: () => void;
  refetch: () => void;
  data: DataTravelType | undefined;
}

const EditTravel: React.FC<EditTravelProps> = ({ onCancel, refetch, data }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  
  

  useEffect(() => {
    if (data) {
      reset({
        titleUz: data.titleUz,
        titleRu: data.titleRu,
        titleEn: data.titleEn,
        descriptionUz: data.descriptionUz,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn,
        days: data.days,
        price: data.price,
        travelDesignerId: data.travelDesigner?.id,
        levelId: data.levels[0].id,
        travelTypeId: data.travelType?.id,
        subTravelId: data?.subTravels?.map((item: any) => item?.id) || [],
        file: [],
      });
    }
  }, [data, reset]);

  const { data: levelData } = useFetch<LevelsType>({
    key: ["levels"],
    url: "/levels",
  });

  const { data: travelDesignersData } = useFetch<TravelDesignersType>({
    key: ["travelDesigners"],
    url: "/travel-designers",
  });

  const { data: travelTypeData } = useFetch<TravelTypesType>({
    key: ["travel-types"],
    url: "/travel-types",
  });

  const { data: subTravelData } = useFetch<SubTravelType>({
    key: ["subtravel"],
    url: "/subtravel",
  });

  const { mutate, isLoading } = useApiMutation({
    url: `/travels/update/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Sayohat muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Sayohat mavjud");
      } else {
        toast.error("Sayohat yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (formDataValues: FormValues) => {
    const formData = new FormData();
    formData.append("titleUz", formDataValues.titleUz);
    formData.append("titleRu", formDataValues.titleRu);
    formData.append("titleEn", formDataValues.titleEn);
    formData.append("descriptionUz", formDataValues.descriptionUz);
    formData.append("descriptionRu", formDataValues.descriptionRu);
    formData.append("descriptionEn", formDataValues.descriptionEn);
    formData.append("days", String(formDataValues.days));
    formData.append("price", String(formDataValues.price));
    formData.append("travelDesignerId", formDataValues.travelDesignerId);
    formData.append("levelId", formDataValues.levelId);
    formData.append("travelTypeId", formDataValues.travelTypeId || "");
    formData.append("subTravelIds", JSON.stringify(formDataValues.subTravelId));
    if (formDataValues.file?.[0]) {
      formData.append("file", formDataValues.file[0]);
    }

    mutate(formData);
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

  const handleCancel = () => {
    reset();
    onCancel();
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
            <TextArea
              {...field}
              rows={4}
              placeholder="Tavsif (Uz)"
              style={{ resize: "none", height: "100px" }}
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
            <TextArea
              {...field}
              rows={4}
              placeholder="Tavsif (Ru)"
              style={{ resize: "none", height: "100px" }}
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
            <TextArea
              {...field}
              rows={4}
              placeholder="Tavsif (En)"
              style={{ resize: "none", height: "100px" }}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Kunlar soni"
        validateStatus={errors.days ? "error" : ""}
        help={errors.days?.message}
      >
        <Controller
          name="days"
          control={control}
          rules={{ required: "Kunlar sonini kiriting" }}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Masalan: 7" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Narx"
        validateStatus={errors.price ? "error" : ""}
        help={errors.price?.message}
      >
        <Controller
          name="price"
          control={control}
          rules={{ required: "Narxni kiriting" }}
          render={({ field }) => (
            <Input type="number" {...field} placeholder="Masalan: 1500000" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Sayohat dizayneri"
        validateStatus={errors.travelDesignerId ? "error" : ""}
        help={errors.travelDesignerId?.message}
      >
        <Controller
          name="travelDesignerId"
          control={control}
          rules={{ required: "Sayohat dizayneri tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohat dizayneri tanlang">
              {travelDesignersData?.items?.map(
                (designer: TravelDesignersType) => (
                  <Select.Option key={designer?.id} value={designer?.id}>
                    {designer?.nameUz}
                  </Select.Option>
                )
              )}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Sayohat turi"
        validateStatus={errors.travelTypeId ? "error" : ""}
        help={errors.travelTypeId?.message}
      >
        <Controller
          name="travelTypeId"
          control={control}
          rules={{ required: "Sayohat turi tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohat turi tanlang">
              {travelTypeData?.items?.map((level: TravelTypesType) => (
                <Select.Option key={level?.id} value={level?.id}>
                  {level?.titleUz}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Daraja"
        validateStatus={errors.levelId ? "error" : ""}
        help={errors.levelId?.message}
      >
        <Controller
          name="levelId"
          control={control}
          rules={{ required: "Daraja tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Daraja tanlang">
              {levelData?.items?.map((level: LevelsType) => (
                <Select.Option key={level?.id} value={level?.id}>
                  {level?.nameUz}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Ichki sayohat"
        validateStatus={errors.subTravelId ? "error" : ""}
        help={errors.subTravelId?.message}
      >
        <Controller
          name="subTravelId"
          control={control}
          rules={{ required: "Ichki sayohat tanlang" }}
          render={({ field }) => (
            <Select
              mode="multiple"
              allowClear
              {...field}
              placeholder="Ichki sayohat tanlang"
            >
              {subTravelData?.items?.map((level: SubTravelType) => (
                <Select.Option key={level?.id} value={level?.id}>
                  {level?.titleUz}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item label="Rasmni yangilash">
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload.Dragger
              accept=".png,.jpeg,.webp"
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
                Yangi faylni bu yerga tashlang yoki yuklang
              </p>
              <p className="ant-upload-hint">
                Faqat .png, .jpeg va .webp fayllar qabul qilinadi
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

export default EditTravel;
