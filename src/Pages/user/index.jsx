import React, { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Popover,
  Table,
  message,
  notification,
} from "antd";
import SearchInput from "./SearchInput";
import { FiTrash } from "react-icons/fi";
import { BsPen } from "react-icons/bs";
import {
  callAllUsers,
  callCreateUsers,
  callDeleteUser,
} from "../../service/api";
import UserViewDetail from "./UserViewDetail";
import * as XLSX from "xlsx";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import ModalCreateUser from "./ModalCreateUser";
import moment from "moment";
import ModalImportData from "./data/ModalImportData";
import ModalUpdateUser from "./ModalUpdateUser";
const UserPage = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [querySort, setQuerySort] = useState("");
  const [dataUserDetail, setDataUserDetail] = useState([]);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [size, setSize] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const handleBtnModalCreateUser = () => {
    setIsModalOpen(true);
  };
  const handleClickBtnImport = () => {
    setIsModalImportOpen(true);
  };
  useEffect(() => {
    getAllUsers();
  }, [current, pageSize, filter, querySort]);
  const getAllUsers = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    setLoading(true);
    if (filter !== "") {
      query += `${filter}`;
    }
    if (querySort !== "") {
      query += `${querySort}`;
    }
    const res = await callAllUsers(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  const handleSubmiteDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    // console.log(res);
    if (res.statusCode === 400) {
      notification.error({
        message: "Response nè  :v",
        description: `${res.message}`,
      });
    } else {
      message.success("Hehe đã xoá rùi nhá :vv");
      getAllUsers();
    }
  };
  const cancel = (e) => {
    console.log(e);
  };
  const handleSearch = (query) => {
    getAllUsers(query);
    setFilter(query);
  };
  const handleRefresh = () => {
    setFilter("");
  };
  const handleSubmitCreateUser = async (data) => {
    const res = await callCreateUsers(data);
    // console.log(res);
    if (res && res.data) {
      setIsModalOpen(false);
      message.success("Thêm mới người dùng thành công");
      const newListUser = [...listUser, res.data];
      setListUser(newListUser);
    } else {
      notification.error({
        message: `${res.message[0]}`,
      });
    }
  };
  const handleClickBtnUpdate = (_id, fullName, email, phone) => {
    setIsModalUpdateOpen(true);
    setDataUpdate({
      _id: _id,
      fullName: fullName,
      email: email,
      phone: phone,
    });
  };
  const columns = [
    {
      title: "Id",
      // dataIndex: "_id",
      render: (record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setDataUserDetail(record);
              setOpenViewDetail(true);
              setSize("large");
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên Hiển Thị",
      dataIndex: "fullName",
      sorter: true,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt) => {
        return <div>{moment(createdAt).format("DD/MM/YYYY hh:mm:ss")}</div>;
      },
    },
    {
      title: "action",
      render: (record) => {
        return (
          <div style={{ display: "flex" }}>
            <Popconfirm
              placement="leftBottom"
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => handleSubmiteDeleteUser(record._id)}
              onCancel={cancel}
              okText="Confirm"
            >
              <FiTrash
                // onClick={}
                style={{ color: "red", marginRight: "10px" }}
              />
            </Popconfirm>
            <BsPen
              style={{ color: "#89D3FF", cursor: "pointer" }}
              onClick={() =>
                handleClickBtnUpdate(
                  record._id,
                  record.fullName,
                  record.email,
                  record.phone
                )
              }
            />
          </div>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
    if (sorter && sorter.order === "ascend") {
      let q = `&sort=${sorter.field}`;
      setQuerySort(q);
    }
    if (sorter && sorter.order === undefined) {
      // let q = `&sort=${sorter.field}`;
      setQuerySort("");
    }
    if (sorter && sorter.order === "descend") {
      let q = `&sort=-${sorter.field}`;
      setQuerySort(q);
    }
    if (sorter && sorter.field === "createdAt") {
      if (sorter.order === "ascend") {
        let q = `&sort=createdAt`;
        setQuerySort(q);
      }
      if (sorter.order === "descend") {
        let q = `&sort=-createdAt`;
        setQuerySort(q);
      }
    }
  };
  const downloadExcel = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ListUser.xlsx");
    }
  };
  return (
    <>
      <div>
        <ModalUpdateUser
          fetchUser={getAllUsers}
          setDataUpdate={setDataUpdate}
          dataUpdate={dataUpdate}
          setIsModalUpdateOpen={setIsModalUpdateOpen}
          isModalUpdateOpen={isModalUpdateOpen}
        />
      </div>
      <div>
        <SearchInput handleSearch={handleSearch} />
      </div>
      <div>
        <Button onClick={handleRefresh} type="primary">
          Refresh
        </Button>
      </div>
      <div>
        <UserViewDetail
          size={size}
          setDataUserDetail={setDataUserDetail}
          dataUserDetail={dataUserDetail}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />
      </div>
      <div>
        <ModalCreateUser
          handleSubmitCreateUser={handleSubmitCreateUser}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
      <div>
        <ModalImportData
          listUser={listUser}
          isModalImportOpen={isModalImportOpen}
          setIsModalImportOpen={setIsModalImportOpen}
          fetchUser={getAllUsers}
        />
      </div>
      <div>
        <Table
          title={() => {
            return (
              <div>
                <>
                  Table List User
                  <>
                    <Button style={{ float: "right" }}>
                      <RedoOutlined />
                    </Button>
                    <Button
                      style={{ float: "right", margin: "0px 5px" }}
                      type="primary"
                      onClick={downloadExcel}
                    >
                      <ExportOutlined />
                      Export
                    </Button>
                    <Button
                      style={{ float: "right", margin: "0px 5px" }}
                      type="primary"
                      onClick={handleClickBtnImport}
                    >
                      <CloudUploadOutlined />
                      Import
                    </Button>
                    <Button
                      onClick={handleBtnModalCreateUser}
                      style={{ float: "right" }}
                      type="primary"
                    >
                      <PlusOutlined />
                      Thêm mới
                    </Button>
                  </>
                </>
              </div>
            );
          }}
          rowKey="_id"
          columns={columns}
          dataSource={listUser}
          onChange={onChange}
          loading={loading}
          pagination={{
            current: current,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: [2, 10, 20, 50, 100],
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} trên {total} rows
                </div>
              );
            },
          }}
        />
      </div>
    </>
  );
};

export default UserPage;
