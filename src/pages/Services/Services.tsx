import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import UniversalModal from "../../components/UniversalModal";
import EditServices from "./modules/EditServices";
import AddServices from "./modules/AddServices";
import { DataServicesType, ModulsType } from "../../types/types";


type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;


const Services = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [servicesSingleData, setServicesSingleData] = useState<DataServicesType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useFetch<DataServicesType>({
    key: ["services", pagination.current, pagination.pageSize, search],
    url: "/services",
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: "/services/delete",
    method: "DELETE",
    onSuccess: () => {
      toast.success("Xizmat muvaffaqiyatli o‘chirildi");
      refetch();
    },
    onError: () => {
      toast.error("Xizmat o‘chirishda xatolik yuz berdi");
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: DataServicesType, type: ModulsType) => {
    setServicesSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: DataServicesType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<DataServicesType> = [
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
      title: "Daraja",
      dataIndex: "levels",
      render: (record: any) => <span>{record?.[0]?.name}</span>
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-[23px] font-semibold">Xizmatlar</div>
        <div className="flex items-center gap-3">
          <Search
            placeholder="Qidiruv"
            onSearch={onSearch}
            enterButton
            allowClear
          />
          <Button type="primary" onClick={() => showModal("add")}>
            Qo'shish
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.items || []}
        rowKey="id"
        loading={isLoading}
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
        title={formType === "edit" ? "Xizmatni tahrirlash" : "Xizmat qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? (
          <EditServices
            onCancel={handleCancel}
            data={servicesSingleData}
            refetch={refetch}
          />
        ) : (
          <AddServices refetch={refetch} onCancel={handleCancel} />
        )}
      </UniversalModal>
    </div>
  );
};

export default Services;
