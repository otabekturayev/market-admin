import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch";
import { LevelsType, TravelDesignersType, TravelTypesType } from "../../../types/types";

const { TextArea } = Input;

type FormValues = {
  title: string;
  description: string;
  days: number;
  price: number;
  travelDesignerId: string;
  levelId: string;
  file: RcFile[];
  travelTypeId: string | null | undefined;
};

interface EditTravelProps {
  onCancel: () => void;
  refetch: () => void;
  data: any;
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
        title: data.title,
        description: data.description,
        days: data.days,
        price: data.price,
        travelDesignerId: data.travelDesigner?.id,
        levelId: data.levels[0].id,
        travelTypeId: data.travelTypeId,
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
    formData.append("title", formDataValues.title);
    formData.append("description", formDataValues.description);
    formData.append("days", String(formDataValues.days));
    formData.append("price", String(formDataValues.price));
    formData.append("travelDesignerId", formDataValues.travelDesignerId);
    formData.append("levelId", formDataValues.levelId);
    formData.append("travelTypeId", formDataValues.travelTypeId || "");
    if (formDataValues.file?.[0]) {
      formData.append("file", formDataValues.file[0]);
    }

    mutate(formData);
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowed = ["image/png", "image/jpeg", "image/webp"].includes(file.type);
    if (!isAllowed) {
      toast.error("Faqat .png, .jpeg, .webp rasm fayllari yuklanadi");
    }
    return isAllowed || Upload.LIST_IGNORE;
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item label="Sarlavha" validateStatus={errors.title ? "error" : ""} help={errors.title?.message}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Sarlavhani kiriting" }}
          render={({ field }) => <Input {...field} placeholder="Sarlavha" />}
        />
      </Form.Item>

      <Form.Item label="Tavsif" validateStatus={errors.description ? "error" : ""} help={errors.description?.message}>
        <Controller
          name="description"
          control={control}
          rules={{ required: "Tavsif kiriting" }}
          render={({ field }) => <TextArea {...field} rows={4} placeholder="Tavsif" style={{ resize: 'none', height: '100px'}} />}
        />
      </Form.Item>

      <Form.Item label="Kunlar soni" validateStatus={errors.days ? "error" : ""} help={errors.days?.message}>
        <Controller
          name="days"
          control={control}
          rules={{ required: "Kunlar sonini kiriting" }}
          render={({ field }) => <Input type="number" {...field} placeholder="Masalan: 7" />}
        />
      </Form.Item>

      <Form.Item label="Narx" validateStatus={errors.price ? "error" : ""} help={errors.price?.message}>
        <Controller
          name="price"
          control={control}
          rules={{ required: "Narxni kiriting" }}
          render={({ field }) => <Input type="number" {...field} placeholder="Masalan: 1500000" />}
        />
      </Form.Item>

      <Form.Item label="Sayohat dizayneri" validateStatus={errors.travelDesignerId ? "error" : ""} help={errors.travelDesignerId?.message}>
        <Controller
          name="travelDesignerId"
          control={control}
          rules={{ required: "Sayohat dizayneri tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Sayohat dizayneri tanlang">
              {travelDesignersData?.items?.map((designer: TravelDesignersType) => (
                <Select.Option key={designer?.id} value={designer?.id}>
                  {designer?.name}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item label="Sayohat turi" validateStatus={errors.travelTypeId ? "error" : ""} help={errors.travelTypeId?.message}>
              <Controller
                name="travelTypeId"
                control={control}
                rules={{ required: "Sayohat turi tanlang" }}
                render={({ field }) => (
                  <Select {...field} placeholder="Sayohat turi tanlang">
                    {travelTypeData?.items?.map((level: TravelTypesType) => (
                      <Select.Option key={level?.id} value={level?.id}>
                        {level?.title}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>

      <Form.Item label="Daraja" validateStatus={errors.levelId ? "error" : ""} help={errors.levelId?.message}>
        <Controller
          name="levelId"
          control={control}
          rules={{ required: "Daraja tanlang" }}
          render={({ field }) => (
            <Select {...field} placeholder="Daraja tanlang">
              {levelData?.items?.map((level: LevelsType) => (
                <Select.Option key={level?.id} value={level?.id}>
                  {level?.name}
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
              <p className="ant-upload-text">Yangi faylni bu yerga tashlang yoki yuklang</p>
              <p className="ant-upload-hint">Faqat .png, .jpeg va .webp fayllar qabul qilinadi</p>
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
