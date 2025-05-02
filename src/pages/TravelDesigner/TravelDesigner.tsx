import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import EditTravelDesigner from "./modules/EditTravelDesigner";
import AddTravelDesigner from "./modules/AddTravelDesigner";
import { ModulsType, TravelDesignersType } from "../../types/types";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;


const TravelDesigners = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [travelDesignersSingleData, setTravelDesignersSingleData] = useState<TravelDesignersType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  
  const { data, isLoading, refetch } = useFetch<TravelDesignersType>({
    key: ['travel_designers', pagination.current, pagination.pageSize, search],
    url: '/travel-designers',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        name: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: '/travel-designers',
    method: 'DELETE',
    onSuccess: () => {
      toast.success('Sayohat dizayneri muvaffaqiyatli o‘chirildi')
      refetch()
    },
    onError: () => {
      toast.error('Sayohat dizayneri o‘chirishda xatolik yuz berdi')
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: TravelDesignersType, type: ModulsType) => {
    setTravelDesignersSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: TravelDesignersType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<TravelDesignersType> = [
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
      title: "Ismi (Uz)",
      dataIndex: "nameUz",
      key: "nameUz",
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
      title: "Ismi (Ru)",
      dataIndex: "nameRu",
      key: "nameRu",
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
      title: "Ismi (En)",
      dataIndex: "nameEn",
      key: "nameEn",
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Haqida (Uz)",
      dataIndex: "aboutUz",
      key: "aboutUz",
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
      title: "Haqida (Ru)",
      dataIndex: "aboutRu",
      key: "aboutRu",
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
      title: "Haqida (En)",
      dataIndex: "aboutEn",
      key: "aboutEn",
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
        <div className="text-[23px] font-semibold">Sayohat dizaynerlari</div>
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
        title={formType === "edit" ? "Sayohat dizaynerini tahrirlash" : "Sayohat dizayneri qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditTravelDesigner onCancel={handleCancel} data={travelDesignersSingleData} refetch={refetch}/> : <AddTravelDesigner refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default TravelDesigners;
