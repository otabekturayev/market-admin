import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";

import { ModulsType, SubTrivelIdeasType} from "../../types/types";
import EditSubTrivelIdeas from "./modules/EditSubTrivelIdeas";
import AddSubTRavelIdeas from "./modules/AddSubTrivelIdeas";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;


const SubTRivelIdeas = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [subTrivelIdeasSingleData, setSubTrivelIdeasSingleData] = useState<SubTrivelIdeasType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  
  const { data, isLoading, refetch } = useFetch<SubTrivelIdeasType>({
    key: ['sub-travel-ideas', pagination.current, pagination.pageSize, search],
    url: '/sub-travel-ideas',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null
      },
    },
  });

  console.log(data);
  

  const { mutate } = useApiMutation({
    url: '/travel-designers/delete',
    method: 'DELETE',
    onSuccess: () => {
      toast.success("Sayohat g'oyasi muvaffaqiyatli o‘chirildi")
      refetch()
    },
    onError: () => {
      toast.error("Sayohat g'oyasini o‘chirishda xatolik yuz berdi")
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: SubTrivelIdeasType, type: ModulsType) => {
    setSubTrivelIdeasSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: SubTrivelIdeasType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<SubTrivelIdeasType> = [
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
      title: "Sarlavha (Uz)",
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
      title: "Sarlavha (Ru)",
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
      title: "Sarlavha (En)",
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
      title: "Tavsif (Uz)",
      dataIndex: "descriptionUz",
      key: "descriptionUz",
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
      title: "Tavsif (Ru)",
      dataIndex: "descriptionRu",
      key: "descriptionRu",
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
      title: "Tavsif (En)",
      dataIndex: "descriptionEn",
      key: "descriptionEn",
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
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="Travel Designer" className="max-w-[100px] max-h-[150px] h-auto object-cover rounded" />
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
            <Button
              type="text"
              danger
              icon={
                <DeleteOutlined />
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-[23px] font-semibold">Sayohat g'oyasi</div>
        <div className="flex items-center gap-3">
          <Search
            placeholder="Qidiruv"
            onSearch={onSearch}
            enterButton
            allowClear
          />
          <Button type="primary" onClick={() => showModal("add")}>Qo'shish</Button>
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
          pageSizeOptions: ['10', '20', '50'],
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
      />
      <UniversalModal
        open={isModalOpen}
        title={formType === "edit" ? "Sayohat g'oyasini tahrirlash" : "Sayohat g'oyasi qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditSubTrivelIdeas onCancel={handleCancel} data={subTrivelIdeasSingleData} refetch={refetch}/> : <AddSubTRavelIdeas refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default SubTRivelIdeas;
