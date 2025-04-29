import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import EditAttractions from "./modules/EditAttractions";
import AddAttractions from "./modules/AddAttractions";
import { AttractionsDataType, ModulsType } from "../../types/types";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const Attractions = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [attractionsSingleData, setAttractionsSingleData] = useState<AttractionsDataType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

 

  const { data, isLoading, refetch } = useFetch<AttractionsDataType>({
    key: ['attractions', pagination.current, pagination.pageSize, search],
    url: '/attractions',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        title: search || null
      },
    },
  });


  const { mutate } = useApiMutation({
    url: '/attractions',
    method: 'DELETE',
    onSuccess: () => {
      toast.success('Diqqatga sazovor joy muvaffaqiyatli o‘chirildi')
      refetch()
    },
    onError: () => {
      toast.error('Diqqatga sazovor joy o‘chirishda xatolik yuz berdi')
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: AttractionsDataType, type: ModulsType) => {
    setAttractionsSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: AttractionsDataType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<AttractionsDataType> = [
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
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Sayohat",
      dataIndex: "travel",
      render: (record: any) => <span>{record?.title}</span>,
    },
    {
      title: "Rasm",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img src={image} alt="attractions" className="max-w-[100px] h-auto object-cover rounded" />
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
        <div className="text-[23px] font-semibold">Diqqatga sazovor joylar</div>
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
        title={formType === "edit" ? "Diqqatga sazovor joyni tahrirlash" : "Diqqatga sazovor joy qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditAttractions onCancel={handleCancel} data={attractionsSingleData} refetch={refetch}/> : <AddAttractions refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default Attractions;
