import { Table } from "antd";
import { useEffect, useState } from "react";
import { callAllOrder } from "../../service/api";
import moment from "moment";
const ManageOrder = () => {
  const [listOrder, setListOrder] = useState([]);
  const [pages, setPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [querySort, setQuerySort] = useState("");
  const [loading, setLoading] = useState(false);
  // const [q, setQ] = useState(`current=${current}&pageSize=${pageSize}`);
  // const [qSort, setQSort] = useState("");
  const columns = [
    { title: "Id", dataIndex: "_id", sorter: true },
    { title: "Price", dataIndex: "totalPrice", sorter: true },
    { title: "Name", dataIndex: "name", sorter: true },
    { title: "Address", dataIndex: "address", sorter: true },
    { title: "Số điện thoại", dataIndex: "phone", sorter: true },
    {
      title: "Ngày cập nhật",
      sorter: true,
      render: (record) => {
        return <div>{moment(record.updateAt).format("hh:mm:ss DD-MM-YY")}</div>;
      },
    },
  ];
  console.log(querySort);
  const getAllListOrder = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    setLoading(true);
    if (querySort !== "") {
      query = query + `${querySort}`;
    }
    const res = await callAllOrder(query);
    if (res && res?.data && res?.data?.result) {
      setListOrder(res.data.result);
      setPages(res.data.meta.pages);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  console.log(pageSize);
  useEffect(() => {
    getAllListOrder();
  }, [pageSize, current, querySort]);
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (sorter) {
      if (sorter.order === "ascend") {
        const qSort = `&sort=${sorter.field}`;
        setQuerySort(qSort);
      }
      if (sorter.order === "descend") {
        const qSort = `&sort=-${sorter.field}`;
        setQuerySort(qSort);
      }
      if (sorter.order === undefined) {
        setQuerySort(``);
      }
    } else {
    }
  };
  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={listOrder}
      onChange={onChange}
      pagination={{
        current: current,
        total: total,
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: [3, 5, 10, 15, 20],
        showTotal: (total, range) => {
          return (
            <div>
              {range[0]} - {range[1]} trên {total} rows
            </div>
          );
        },
      }}
    />
  );
};

export default ManageOrder;
