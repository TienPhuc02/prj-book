import { Modal, message, Upload, notification } from "antd";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Table } from "antd";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../service/api";
import template from "../data/template.xlsx?url";
const ModalImportData = (props) => {
  const { Dragger } = Upload;
  const [dataExcel, setDataExcel] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleCancel = () => {
    setDataExcel([]);
    setFileList([]);
    props.setIsModalImportOpen(false);
  };
  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
    },
  ];
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const propsUpload = {
    name: "file",
    multiple: true,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "removed") {
        setDataExcel([]);
        setFileList([]);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          setFileList(file);
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1,
            });
            if (json && json.length > 0) {
              setDataExcel(json);
            }
          };
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const isUploadButtonDisabled = fileList.length === 0;
  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    const res = await callBulkCreateUser(data);
    console.log(res);
    if (res.data) {
      notification.success({
        description: `Success:${res.data.countSuccess} ,Error:${res.data.countError}`,
        message: "upload thành công",
      });
      setDataExcel([]);
      setFileList([]);
      props.setIsModalImportOpen(false);
      props.fetchUser();
    } else {
      notification.error({
        description: `Error:${res.message[0]}`,
        message: "upload thất bại",
      });
      setDataExcel([]);
      setFileList([]);
      props.setIsModalImportOpen(false);
      props.fetchUser();
    }
  };
  return (
    <div>
      <Modal
        width={"800px"}
        title="Import Data User"
        open={props.isModalImportOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="Import Data"
        okButtonProps={{
          loading: uploading,
          disabled: isUploadButtonDisabled,
        }}
        maskClosable={false}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload .csv, xls ,xlsx .or &nbsp;
            <a href={template} download onClick={(e) => e.stopPropagation()}>
              {" "}
              Dowload Sample File
            </a>
          </p>
        </Dragger>
        <p>Dữ liệu Upload:</p>
        <Table columns={columns} dataSource={dataExcel}></Table>
      </Modal>
    </div>
  );
};

export default ModalImportData;
