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
import EditOperators from "./modules/EditOperators";
import AddOperators from "./modules/AddOperators";
import { ModulsType, OperatorsType } from "../../types/types";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const Operators = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [operatorsSingleData, setOperatorsSingleData] = useState<OperatorsType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useFetch<OperatorsType>({
    key: ["operators", pagination.current, pagination.pageSize, search],
    url: "/operators",
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        phone: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: "/operators/delete",
    method: "DELETE",
    onSuccess: () => {
      toast.success("Operator muvaffaqiyatli o‘chirildi");
      refetch();
    },
    onError: () => {
      toast.error("Operator o‘chirishda xatolik yuz berdi");
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: OperatorsType, type: ModulsType) => {
    setOperatorsSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: OperatorsType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<OperatorsType> = [
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
      title: "Telfon nomer",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ish vaqti",
      dataIndex: "workTime",
      key: "workTime",
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
        <div className="text-[23px] font-semibold">Operatorlar</div>
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
        title={
          formType === "edit" ? "Operatorni tahrirlash" : "Operator qo'shish"
        }
        onCancel={handleCancel}
      >
        {formType === "edit" ? (
          <EditOperators
            onCancel={handleCancel}
            data={operatorsSingleData}
            refetch={refetch}
          />
        ) : (
          <AddOperators refetch={refetch} onCancel={handleCancel} />
        )}
      </UniversalModal>
    </div>
  );
};

export default Operators;
