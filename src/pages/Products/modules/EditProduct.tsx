import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useApiMutation from "../../../hooks/useMutation";
import { toast } from "react-toastify";
import { CategoryType, ProductsType } from "../../../types/types";
import { useFetch } from "../../../hooks/useFetch";

type FormValues = {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  categoryId: string;
  file: RcFile[];
};

interface EditProductProps {
  onCancel: () => void;
  data: ProductsType | undefined;
  refetch: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({
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

  const { data: categoryData } = useFetch<CategoryType>({
      key: ["category"],
      url: "/category",
    });


  useEffect(() => {
    if (data) {
      reset({
        nameUz: data?.titleUz || "",
        nameRu: data?.titleRu || "",
        nameEn: data?.titleEn || "",
        categoryId: data?.category?.id || "",
        file: [],
      });
    }
  }, [data, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `/products/${data?.id}`,
    method: "PATCH",
    onSuccess: () => {
      reset();
      toast.success("Mahsulot muvaffaqiyatli yangilandi");
      onCancel();
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error("Bunday nomli Mahsulot allaqachon mavjud");
      } else {
        toast.error("Mahsulot yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (formData: FormValues) => {
    const form = new FormData();
    form.append("titleUz", formData.nameUz);
    form.append("titleRu", formData.nameRu);
    form.append("titleEn", formData.nameEn);
    form.append("categoryId", formData.categoryId);
    if (formData.file && formData.file.length > 0) {
      form.append("files", formData.file[0]);
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
             label="Kategoriya"
             validateStatus={errors.categoryId ? "error" : ""}
             help={errors.categoryId?.message}
           >
             <Controller
               name="categoryId"
               control={control}
               rules={{ required: "Kategoriya tanlang" }}
               render={({ field }) => (
                 <Select {...field} placeholder="Kategoriya tanlang">
                   {/* Bu yerga dynamic ravishda maqolalar keladi. Hozircha statik variant qo'yildi */}
                   {categoryData?.items?.map((article: CategoryType) => (
                     <Select.Option key={article?.id} value={article?.id}>
                       {article?.titleUz}
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

export default EditProduct;
