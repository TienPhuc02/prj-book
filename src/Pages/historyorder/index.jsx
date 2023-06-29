import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../service/api";
import moment from "moment";
import ReactJson from "react-json-view";
const index = () => {
  const [listHistory, setListHistory] = useState([]);
  const getOrderHistory = async () => {
    const res = await callOrderHistory();
    console.log(res);
    if (res && res.data) {
      setListHistory(res.data);
    }
  };
  useEffect(() => {
    getOrderHistory();
  }, []);
  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div key={index + 1}>{index + 1}</div>;
      },
    },
    {
      title: "Thời gian",
      render: (text, record, index) => {
        return (
          <div key={index + 1}>
            {moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}
          </div>
        );
      },
    },
    {
      title: "Tổng số tiền",
      render: (record, index) => {
        return (
          <div key={index + 1}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record.totalPrice)}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",

      render: (record, index) => {
        return (
          <div key={index + 1}>
            <Tag color="green">Thành công</Tag>
          </div>
        );
      },
    },
    {
      title: "Chi tiết",
      render: (record, index) => {
        return (
          <div key={index + 1}>
            <ReactJson name="Chi tiết đơn hàng" src={record.detail} />;
          </div>
        );
      },
    },
  ];
  return (
    <Table pagination={false} columns={columns} dataSource={listHistory} />
  );
};
export default index;
