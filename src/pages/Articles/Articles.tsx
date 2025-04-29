import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import EditArticles from "./modules/EditArticles";
import AddArticles from "./modules/AddArticles";
import { useDarkModeStore } from "../../store/darkModeStore";
import { ArticlesType, ModulsType } from "../../types/types";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const Articles = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [articlesSingleData, setArticlesSingleData] =
    useState<ArticlesType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  const { darkMode } = useDarkModeStore();

  const { data, isLoading, refetch } = useFetch<ArticlesType>({
    key: ["articles", pagination.current, pagination.pageSize, search],
    url: "/articles",
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null,
      },
    },
  });

  const { mutate } = useApiMutation({
    url: "/articles/delete",
    method: "DELETE",
    onSuccess: () => {
      toast.success("Maqola muvaffaqiyatli o‘chirildi");
      refetch();
    },
    onError: () => {
      toast.error("Maqola o‘chirishda xatolik yuz berdi");
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: ArticlesType, type: ModulsType) => {
    setArticlesSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: ArticlesType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<ArticlesType> = [
    {
      title: "№",
      render: (_, __, index) => (
        <span>
          {(pagination?.current - 1) * pagination?.pageSize + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Nomi (Uz)",
      dataIndex: "titleUz",
      key: "titleUz",
      render: (text: string) => (
        <div style={{
          maxWidth: 250,
          maxHeight: 150,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {text}
        </div>)
    },
    {
      title: "Nomi (Ru)",
      dataIndex: "titleRu",
      key: "titleRu",
      render: (text: string) => (
        <div style={{
          maxWidth: 250,
          maxHeight: 150,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {text}
        </div>)
    },
    { 
      title: "Nomi (En)",
      dataIndex: "titleEn",
      key: "titleEn",
      render: (text: string) => (
        <div style={{
          maxWidth: 250,
          maxHeight: 150,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {text}
        </div>)
    },
    {
      title: "Rasm",
      dataIndex: "images",
      key: "images",
      render: (image: string) => (
        <img
          src={image}
          alt="Maqola"
          className="max-w-[100px] max-h-[150px] h-auto object-cover rounded"
        />
      ),
    },
    {
      title: "Harakatlar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "green" }} />}
            onClick={() => handleEdit(record, "edit")}
          />
          <Popconfirm
            title="Ushbu ma'lumotni o'chirishga aminmisiz?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    
      <div className="p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className={`text-[23px] font-semibold ${darkMode ? "text-[#ffffffa6]" : "text-[#000]"}`}>
            Maqolalar
          </div>
          <div className="flex items-center gap-3">
            <Search
              placeholder="Qidiruv"
              onSearch={onSearch}
              enterButton
              allowClear
            />
            <Button
              type="primary"
              onClick={() => showModal("add")}
            >
              Qo'shish
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data?.items || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0, // agar backend totalni jo'natsa
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
        <UniversalModal
          open={isModalOpen}
          title={formType === "edit" ? "Maqolani tahrirlash" : "Maqola qo'shish"}
          onCancel={handleCancel}
        >
          {formType === "edit" ? (
            <EditArticles
              onCancel={handleCancel}
              data={articlesSingleData}
              refetch={refetch}
            />
          ) : (
            <AddArticles refetch={refetch} onCancel={handleCancel} />
          )}
        </UniversalModal>
      </div>
  );
};

export default Articles;
