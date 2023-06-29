import { Col, InputNumber, Modal, Row, Upload, message } from "antd";
import { Select } from "antd";
import { Form, Input } from "antd";
import {
  callBookCategory,
  callCreateNewBook,
  callUpdateBook,
  callUploadBookImg,
} from "../../service/api";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { v4 as uuidv4 } from "uuid";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ModalUpdateBook = (props) => {
  const [categoryBook, setCategoryBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [initForm, setInitForm] = useState(null);
  const handleCancel = () => {
    setPreviewOpen(false);
  };
  const onChangeCategory = (value) => {
    // console.log(`selected ${value}`);
  };
  const onChangeQuantity = (value) => {
    // console.log("changed", value);
  };
  const onSearch = (value) => {};
  const getBookCategory = async () => {
    const res = await callBookCategory();
    if (res && res?.data) {
      setCategoryBook(res.data);
    }
  };
  const onChangeSold = (value) => {
    // console.log("changed", value);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info, type) => {
    // console.log(info);
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      type ? setLoadingSlider(false) : setLoading(false);
      getBase64(info.file.originFileObj, (url) => {
        setImageUrl(url);
      });
    }
  };
  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    // console.log(file);
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail({
        name: res.data.fileUploaded,
        uid: file.uid,
      });
    }
    onSuccess("ok");
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);

    if (res && res.data) {
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
    }
    onSuccess("ok");
  };
  // console.log(dataSlider, dataThumbnail);
  const handlePreview = async (file, type) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  useEffect(() => {
    getBookCategory();
  }, []);
  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
      props.form.setFieldsValue({ slider: { fileList: newSlider } });
    }
  };
  useEffect(() => {
    if (props.dataUpdateBook?._id) {
      const imgThumbnail = [
        {
          uid: uuidv4(),
          name: `${props.dataUpdateBook.thumbnail}`,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            props.dataUpdateBook.thumbnail
          }`,
        },
      ];
      const imgSlider = props.dataUpdateBook?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: props.dataUpdateBook._id,
        mainText: props.dataUpdateBook.mainText,
        author: props.dataUpdateBook.author,
        category: props.dataUpdateBook.category,
        price: props.dataUpdateBook.price,
        quantity: props.dataUpdateBook.quantity,
        sold: props.dataUpdateBook.sold,
        thumbnail: { fileList: imgThumbnail },
        slider: { fileList: imgSlider },
      };
      setInitForm(init);
      setDataSlider(imgSlider);
      setDataThumbnail(imgThumbnail);
      props.form.setFieldsValue(init);
    }
    return () => {
      props.form.resetFields();
    };
  }, [props.dataUpdateBook]);
  // console.log(dataThumbnail);
  const handleFormSubmit = async (values) => {
    try {
      props.form.validateFields();
      const { _id, mainText, author, price, category, quantity, sold } = values;

      // Retrieve the thumbnail name from the dataThumbnail array
      const thumbnail = dataThumbnail.length > 0 ? dataThumbnail[0].name : null;

      const slider = dataSlider.map((item) => item.name);
      const res = await callUpdateBook(_id, {
        mainText,
        author,
        price,
        category,
        quantity,
        sold,
        slider,
        thumbnail,
      });

      if (res && res.data) {
        message.success("Cập nhật thành công");
        setInitForm(null);
        props.handleCloseBtnModalUpdateBook();
        await props.getAllBooks();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Modal
        open={props.openModalUpdateBook}
        onCancel={props.handleCloseBtnModalUpdateBook}
        onOk={() => props.form.submit()}
        okText="Cập nhật"
        cancelText="Huỷ"
        title="Cập nhật Book"
        width={"700px"}
      >
        <Form
          onFinish={handleFormSubmit}
          form={props.form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Tên sách"
                name="mainText"
                rules={[
                  {
                    required: true,
                    message: "Please input your mainText!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col hidden className="gutter-row">
              <Form.Item
                hidden
                label="Id"
                name="_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your mainText!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Please input your author!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Giá tiền"
                name="price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Thể loại"
                name="category"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChangeCategory}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={categoryBook.map((item) => {
                    return {
                      value: `${item}`,
                      label: `${item}`,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Số Lượng"
                name="quantity"
              >
                <InputNumber onChange={onChangeQuantity} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Đã bán"
                name="sold"
              >
                <InputNumber
                  // initialValues={{
                  //   sold: 0,
                  // }}
                  onChange={onChangeSold}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thumbnail" name="thumbnail">
                <div>
                  <Upload
                    onPreview={handlePreview}
                    customRequest={handleUploadFileThumbnail}
                    maxCount={1}
                    multiple={false}
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={true}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                    defaultFileList={initForm?.thumbnail?.fileList ?? []}
                  >
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                    <Modal
                      open={previewOpen}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancel}
                    >
                      <img
                        alt="example"
                        style={{
                          width: "100%",
                        }}
                        src={previewImage}
                      />
                    </Modal>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh slider" name="slider">
                <div>
                  <Upload
                    onPreview={handlePreview}
                    multiple
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={true}
                    customRequest={handleUploadFileSlider}
                    beforeUpload={beforeUpload}
                    onChange={(info) => handleChange(info, "slider")}
                    onRemove={(file) => handleRemoveFile(file, "slider")}
                    defaultFileList={initForm?.slider?.fileList ?? []}
                  >
                    <div>
                      {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpdateBook;
