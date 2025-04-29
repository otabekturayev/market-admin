import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import EditDays from "./modules/EditDays";
import AddDays from "./modules/AddDays";
import { DataDaysType, ModulsType } from "../../types/types";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const Days = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [daysSingleData, setDaysSingleData] = useState<DataDaysType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useFetch<DataDaysType>({
    key: ['days', pagination.current, pagination.pageSize, search],
    url: '/days',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: '/days/delete',
    method: 'DELETE',
    onSuccess: () => {
      toast.success('Kun muvaffaqiyatli o‘chirildi')
      refetch()
    },
    onError: () => {
      toast.error('Kun o‘chirishda xatolik yuz berdi')
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: DataDaysType, type: ModulsType) => {
    setDaysSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: DataDaysType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<DataDaysType> = [
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
      title: "Nomi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Viloyat",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Matn",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Sayohat",
      dataIndex: "travel",
      render: (travels: any) => <span>{travels?.title}</span>,
    },
    {
      title: "Latitude",
      dataIndex: "lat",
      key: "lat",
    },
    {
      title: "Longitude",
      dataIndex: "long",
      key: "long",
    },
    {
      title: "Rasm",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="Travel Designer" className="max-w-[100px] h-auto object-cover rounded" />
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
        <div className="text-[23px] font-semibold">Kunlar</div>
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
        title={formType === "edit" ? "Kunni tahrirlash" : "Kun qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditDays onCancel={handleCancel} data={daysSingleData} refetch={refetch}/> : <AddDays refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default Days;
