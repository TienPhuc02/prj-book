import {
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Popover, Table } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { BsTrash } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { callDeleteBook } from "../../service/api";
import * as XLSX from "xlsx";
const TableBook = (props) => {
  useEffect(() => {
    props.getAllBooks();
  }, [props.query, props.current, props.total]);
  const handleSubmiteDeleteBook = async (id) => {
    const res = await callDeleteBook(id);
    // console.log(res);
    if (res && res.data) {
      props.getAllBooks();
    }
  };
  const downloadExcel = () => {
    if (props.listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(props.listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "listBook.xlsx");
    }
  };
  const columns = [
    {
      title: "Id",
      // dataIndex: "_id",
      render: (record) => {
        return (
          <div  style={{maxWidth:"50%"}}>
            <a
            style={{widmaxWidthth:"50%"}}
              onClick={() => {
                props.handleShowDrawer();
                props.setDataDetailBook(record);
              }}
            >
              {record._id}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt) => {
        return (
          <>
            <div>{moment(createdAt).format("DD-MM-YYYY hh:mm:ss")}</div>
          </>
        );
      },
    },
    {
      title: "Action",
      render: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#F48728",
            }}
          >
            <Popconfirm
              placement="leftBottom"
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => handleSubmiteDeleteBook(record._id)}
              // onCancel={cancel}
              okText="Confirm"
            >
              <BsTrash
                // onClick={}
                style={{
                  cursor: "pointer",
                  color: "#F48728",
                  marginRight: "10px",
                }}
              />
            </Popconfirm>
            <AiFillEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.handleOpenBtnModalUpdateBook();
                props.setDataUpdateBook(record);
              }}
            />
          </div>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
    // console.log(props.current);
    if (
      pagination &&
      pagination.current &&
      pagination.current !== props.current
    ) {
      const newCurrent = pagination.current;
      props.setCurrent(newCurrent);
      props.setQuery(`current=${newCurrent}&pageSize=${props.pageSize}`);
    }
    if (pagination && pagination.pageSize !== props.pageSize) {
      const newPageSize = pagination.pageSize;
      props.setPageSize(newPageSize);
      props.setQuery(`current=${props.current}&pageSize=${newPageSize}`);
    }
    if (sorter && sorter.field && sorter.order === "ascend") {
      props.setQuery(props.query + `&sort=-${sorter.field}`);
    }
    if (sorter && sorter.field && sorter.order === "descend") {
      props.setQuery(props.query + `&sort=${sorter.field}`);
    }
    if (sorter && sorter.field && sorter.order === undefined) {
      props.setQuery(`current=${props.current}&pageSize=${props.pageSize}`);
    }
  };
  return (
    <Table
      loading={props.isLoading}
      title={() => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between"}}>
            <div>Table Lists Book</div>
            <div>
              <Button
                style={{ float: "right", margin: "0px 5px" }}
                type="primary"
                onClick={downloadExcel}
              >
                <ExportOutlined />
                Export
              </Button>
              <Button
                onClick={props.handleOpenBtnModalCreateBook}
                style={{ margin: "0px 10px" }}
                type="primary"
              >
                <PlusOutlined />
                Thêm mới
              </Button>
              <Button>
                <ReloadOutlined />
              </Button>
            </div>
          </div>
        );
      }}
      columns={columns}
      dataSource={props.listBook}
      onChange={onChange}
      pagination={{
        current: props.current,
        pageSize: props.pageSize,
        total: props.total,
        showSizeChanger: true,
        pageSizeOptions: [2, 5, 10, 20, 50, 100],
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

export default TableBook;
