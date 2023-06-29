import { Row, Col, Rate, Divider, Button, message } from "antd";
import "../bookDetail/book.scss";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import BookLoader from "./bookLoader";
import { callAllBooks, callImageBook } from "../../service/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doBookAction } from "../../redux/order/orderSlice";
const ViewDetail = (props) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataBook, setDataBook] = useState([]);
  const refGallery = useRef(null);
  const [activeBookLoader, setActiveBookLoader] = useState(false);
  const [quantityNumber, setQuantityNumber] = useState(1);
  const location = useLocation();
  const navigate = useNavigate("/");
  const [images, setImages] = useState([]);
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");
  const getImages = (raw) => {
    if (raw.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
      });
    }
    if (raw.slider) {
      raw.slider.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        });
      });
    }
  };
  const handleMinusQuantity = () => {
    setQuantityNumber((prevNumber) => +prevNumber - 1);
    if (quantityNumber <= 1) {
      setQuantityNumber(1);
    }
  };
  const handlePlusQuantity = () => {
    setQuantityNumber((prevNumber) => +prevNumber + 1);
    if (quantityNumber >= dataBook.quantity) {
      setQuantityNumber(dataBook.quantity);
    }
  };
  const getDataBook = async () => {
    const res = await callImageBook(id);
    if (res && res.data) {
      setTimeout(() => {
        getImages(res.data);
        setDataBook(res.data);
      }, 2000);
    }
  };
  const dispatch = useDispatch();
  const handleAddToCart = (quantity, book) => {
    dispatch(doBookAction({ quantity, detail: book, _id: book._id }));
    message.success("Thêm vào giỏ hàng thành công");
  };
  const handleChangeQuantityNumber = (value) => {
    setQuantityNumber(value);
    if (value >= dataBook.quantity) {
      setQuantityNumber(dataBook.quantity);
    }
  };
  useEffect(() => {
    getDataBook();
  }, []);

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const onChange = (value) => {
    console.log("changed", value);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        {dataBook && dataBook._id ? (
          <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
            <Row gutter={[20, 20]}>
              <Col md={10} sm={0} xs={0}>
                <ImageGallery
                  ref={refGallery}
                  items={images}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  slideOnThumbnailOver={true} //onHover => auto scroll images
                  onClick={() => handleOnClickImage()}
                />
              </Col>
              <Col md={14} sm={24}>
                <Col md={0} sm={24} xs={24}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    showThumbnails={false}
                  />
                </Col>
                <Col span={24}>
                  <div className="author">
                    Tác giả: <a href="#">{dataBook.author}</a>{" "}
                  </div>
                  <div className="title">{dataBook.mainText}</div>
                  <div className="rating">
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 12 }}
                    />
                    <span className="sold">
                      <Divider type="vertical" />
                      Đã bán {dataBook.sold}
                    </span>
                  </div>
                  <div className="price">
                    <span className="currency">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(dataBook.price)}
                    </span>
                  </div>
                  <div className="delivery">
                    <div>
                      <span className="left">Vận chuyển</span>
                      <span className="right">Miễn phí vận chuyển</span>
                    </div>
                  </div>
                  <div className="quantity">
                    <span className="left">Số lượng</span>
                    <span className="right">
                      <button onClick={() => handleMinusQuantity()}>
                        <MinusOutlined />
                      </button>
                      <input
                        onChange={(e) =>
                          handleChangeQuantityNumber(e.target.value)
                        }
                        value={quantityNumber}
                      />
                      <button onClick={() => handlePlusQuantity()}>
                        <PlusOutlined />
                      </button>
                    </span>
                  </div>
                  <div className="buy">
                    <button className="cart">
                      {/* <BsCartPlus className="icon-cart" /> */}
                      <span
                        onClick={() =>
                          handleAddToCart(quantityNumber, dataBook)
                        }
                      >
                        Thêm vào giỏ hàng
                      </span>
                    </button>
                    <button className="now">Mua ngay</button>
                  </div>
                </Col>
              </Col>
            </Row>
          </div>
        ) : (
          <BookLoader activeBookLoader={activeBookLoader} />
        )}
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
        title={"hardcode"}
      />
    </div>
  );
};

export default ViewDetail;
