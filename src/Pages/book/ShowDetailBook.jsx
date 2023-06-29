import { Divider, Drawer } from "antd";
import { Badge, Descriptions } from "antd";
import moment from "moment";

import { Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ShowDetailBook = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
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
    if (props.dataDetailBook) {
      // console.log(props.dataDetailBook);
      let imgThumbnail = {};
      let imgSlider = [];
      if (props.dataDetailBook.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: props.dataDetailBook.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            props.dataDetailBook.thumbnail
          }`,
        };
      }
      if (props.dataDetailBook.slider) {
        props.dataDetailBook.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [props.dataDetailBook]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <>
      <Drawer
        size="large"
        title="Chức năng xem chi tiết"
        placement="right"
        onClose={props.handleCloseDrawer}
        open={props.openDrawer}
      >
        <Descriptions bordered title="Thông tin Book" column={2}>
          <Descriptions.Item label="Id">
            {props.dataDetailBook._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {props.dataDetailBook.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {props.dataDetailBook.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {props.dataDetailBook.price}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge
              status="processing"
              text={`${props.dataDetailBook.category}`}
            ></Badge>
          </Descriptions.Item>
          <Descriptions.Item label="CreatedAt">
            {moment(props.dataDetailBook.createAt).format(
              "DD-MM-YYYY hh:mm:ss"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="UpdateAt">
            {moment(props.dataDetailBook.createAt).format(
              "DD-MM-YYYY hh:mm:ss"
            )}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left" plain>
          Ảnh Books
        </Divider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          showUploadList={{
            showRemoveIcon: false,
          }}
          onChange={handleChange}
        ></Upload>
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
      </Drawer>
    </>
  );
};
export default ShowDetailBook;
