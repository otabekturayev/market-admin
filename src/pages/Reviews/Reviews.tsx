import { Button, Input, Table, Space, Popconfirm } from "antd";
import type { GetProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import UniversalModal from "../../components/UniversalModal";
import { useFetch } from "../../hooks/useFetch";
import useApiMutation from "../../hooks/useMutation";
import { toast } from "react-toastify";
import { ModulsType, ReviewsType } from "../../types/types";
import EditReview from "./modules/EditReview";
import AddReview from "./modules/AddReview";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const Reviews = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reviewSingleData, setReviewSingleData] = useState<ReviewsType>();
  const [formType, setFormType] = useState<ModulsType>("");
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useFetch<ReviewsType>({
    key: ['reviews', pagination.current, pagination.pageSize, search],
    url: '/reviews',
    config: {
      params: {
        page: pagination.current,
        limit: pagination.pageSize,
        userName: search || null
      },
    },
  });

  const { mutate } = useApiMutation({
    url: '/reviews/delete',
    method: 'DELETE',
    onSuccess: () => {
      toast.success('Izoh muvaffaqiyatli o‘chirildi')
      refetch()
    },
    onError: () => {
      toast.error('Izoh o‘chirishda xatolik yuz berdi')
    },
  });

  const showModal = (type: ModulsType) => {
    setIsModalOpen(true);
    setFormType(type);
  };

  const handleEdit = (record: ReviewsType, type: ModulsType) => {
    setReviewSingleData(record);
    showModal(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (record: ReviewsType) => {
    mutate({ id: record?.id });
  };

  const columns: ColumnsType<ReviewsType> = [
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
      title: "Username",
      dataIndex: "userName",
      key: "userName",
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
      title: "Reyting",
      dataIndex: "rate",
      key: "rate",
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
      title: "Matn (Uz)",
      dataIndex: "textUz",
      key: "textUz",
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
      title: "Matn (Ru)",
      dataIndex: "textRu",
      key: "textRu",
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
      title: "Matn (En)",
      dataIndex: "textEn",
      key: "textEn",
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
        <img src={image} alt="reviews" className="max-w-[100px] max-h-[150px] h-auto object-cover rounded" />
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
        <div className="text-[23px] font-semibold">Izohlar</div>
        <div className="flex items-center gap-3">
          <Search
            placeholder="Qidiruv (userName)"
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
        title={formType === "edit" ? "Izohni tahrirlash" : "Izoh qo'shish"}
        onCancel={handleCancel}
      >
        {formType === "edit" ? <EditReview onCancel={handleCancel} data={reviewSingleData} refetch={refetch}/> : <AddReview refetch={refetch} onCancel={handleCancel}/>} 
      </UniversalModal>
    </div>
  );
};

export default Reviews;
