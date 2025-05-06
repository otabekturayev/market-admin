import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import { ModulsType, SubTrivelIdeasType, TRavelIdeasType } from "../../types/types";
import EditTRavelIdeas from "./modules/EditTRavelIdeas";
import AddTravelIdeas from "./modules/AddTravelIdeas";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const TravelIdeas = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [subArticlesSingleData, setSubArticlesSingleData] = useState<TRavelIdeasType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useFetch<TRavelIdeasType>({
    key: ['travel-ideas', pagination.current, pagination.pageSize, search],
    url: '/travel-ideas',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: '/travel-ideas/delete',
    method: 'DELETE',
    onSuccess: () => {
      toast.success('Sayohat g\'oyalari muvaffaqiyatli o‘chirildi')
      refetch()
    },
    onError: () => {
      toast.error('Sayohat g\'oyalarini o‘chirishda xatolik yuz berdi')
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type)}

  const handleEdit = (record: TRavelIdeasType, type: ModulsType) => {
    setSubArticlesSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: TRavelIdeasType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<TRavelIdeasType> = [
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
      title: "Kichkina Tavsif (Uz)",
      dataIndex: "miniInfoUz",
      key: "miniInfoUz",
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
      title: "Kichkina Tavsif (Ru)",
      dataIndex: "miniInfoRu",
      key: "miniInfoRu",
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
      title: "Kichkina Tavsif (En)",
      dataIndex: "miniInfoEn",
      key: "miniInfoEn",
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
        <img src={image} alt="Travel Ideas" className="max-w-[100px] max-h-[150px] h-auto object-cover rounded" />
      ),
    },
    {
      title: "Qo'shimcha sarlavha (Uz)",
      dataIndex: "subTitleUz",
      key: "subTitleUz",
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
      title: "Qo'shimcha sarlavha (Ru)",
      dataIndex: "subTitleRu",
      key: "subTitleRu",
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
      title: "Qo'shimcha sarlavha (En)",
      dataIndex: "subTitleEn",
      key: "subTitleEn",
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
      title: "Qo'shimcha rasm",
      dataIndex: "subImage",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="subTravel Ideas" className="max-w-[100px] max-h-[150px] h-auto object-cover rounded" />
      ),
    },
    {
      title: "Qo'shimcha tavsif (Uz)",
      dataIndex: "subDescriptionUz",
      key: "subDescriptionUz",
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
      title: "Qo'shimcha tavsif (Ru)",
      dataIndex: "subDescriptionRu",
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
      title: "Qo'shimcha tavsif (En)",
      dataIndex: "subDescriptionEn",
      key: "subDescriptionEn",
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
      title: "Sayohat g'oyasi",
      dataIndex: "subTravelIdea",
      render: (record: SubTrivelIdeasType) => <span>{record?.titleUz}</span>,
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
        <div className="text-[23px] font-semibold">Sayohat g'oyalari</div>
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
        title={formType === "edit" ? "Kichkina maqolani tahrirlash" : "Kichkina maqola qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditTRavelIdeas onCancel={handleCancel} data={subArticlesSingleData} refetch={refetch}/> : <AddTravelIdeas refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default TravelIdeas;
