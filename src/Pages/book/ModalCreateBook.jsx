import {
  Col,
  InputNumber,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { Select } from "antd";
import { Form, Input } from "antd";
import {
  callBookCategory,
  callCreateNewBook,
  callUploadBookImg,
} from "../../service/api";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ModalCreateBook = (props) => {
  const [categoryBook, setCategoryBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [uploadedSliderImages, setUploadedSliderImages] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imageThumbnail, setImageThumbnail] = useState([]);
  const [imageSlider, setImageSlider] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const onChangeCategory = (value) => {
    // console.log(`selected ${value}`);
  };
  const onChangeQuantity = (value) => {
    // console.log("changed", value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const getBookCategory = async () => {
    const res = await callBookCategory();
    if (res && res?.data && res.data.data) {
      setCategoryBook(res.data.data);
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
    console.log(file);
    const res = await callUploadBookImg(file);
    console.log(
      "🚀 ~ file: ModalCreateBook.jsx:85 ~ handleUploadFileThumbnail ~ res:",
      res
    );
    if (res && res.data && res.data.file) {
      setDataThumbnail({
        name: res.data.file.filename,
        uid: file.uid,
      });
      setImageThumbnail(file.name);
      console.log(imageThumbnail);
      console.log(dataThumbnail);
      onSuccess("ok");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    console.log(file.name);
    try {
      const res = await callUploadBookImg(file);
      if (res && res.data && res.data.file) {
        setDataSlider((dataSlider) => [
          ...dataSlider,
          {
            name: res.data.file.filename,
            uid: file.uid,
          },
        ]);
        setImageSlider((imageSlider) => [...imageSlider, file.name]);
        console.log("dataSlider", dataSlider);
        console.log("imageSlider", imageSlider);
        onSuccess("ok");
      }
    } catch (error) {
      onError(error);
    }
  };
  // console.log(imageSlider, imageThumbnail);
  const handlePreview = async (file) => {
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
  const onFinish = async (values) => {
    if (dataThumbnail && dataThumbnail.length === 0) {
      notification.error({
        message: "có lỗi xảy ra",
        description: "vui lòng upload ảnh thumbnail",
      });
      return;
    }
    if (dataSlider && dataSlider.length === 0) {
      notification.error({
        message: "có lỗi xảy ra",
        description: "vui lòng upload ảnh slider",
      });
      return;
    }

    const { mainText, author, price, sold, quantity, category } = values;
    const thumbnail = imageThumbnail;
    const slider = imageSlider.map((item) => item);
    const res = await callCreateNewBook({
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
      thumbnail,
      slider,
    });
    console.log(res);
    if (res && res.data) {
      message.success("tạo mới thành công");
      props.form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setImageSlider([]);
      setImageThumbnail([]);
      props.handleCloseBtnModalCreateBook();
      await props.getAllBooks();
    } else {
      notification.error({
        message: "có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataSlider([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };
  return (
    <>
      <Modal
        open={props.openModalCreateBook}
        onCancel={props.handleCloseBtnModalCreateBook}
        onOk={() => {
          props.form.submit();
        }}
        okText="Tạo mới"
        cancelText="Huỷ"
        title="Thêm mới Book"
        width={"700px"}
      >
        <Form
          onFinish={onFinish}
          form={props.form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          // defaultValue={{
          //   remember: true,
          // }}
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
                  // defaultValue={{
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
export default ModalCreateBook;
