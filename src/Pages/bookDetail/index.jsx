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
import { useDispatch, useSelector } from "react-redux";
import { doBookAction, doUpdateOrder } from "../../redux/order/orderSlice";
const ViewDetail = (props) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataBook, setDataBook] = useState([]);
  const refGallery = useRef(null);
  const [activeBookLoader, setActiveBookLoader] = useState(false);
  const [quantityNumber, setQuantityNumber] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const cartArray = useSelector((state) => state.order.cart);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
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
    console.log("🚀 ~ file: index.jsx:59 ~ getDataBook ~ res:", res);
    if (res && res.data) {
      setTimeout(() => {
        getImages(res.data[0]);
        setDataBook(res.data[0]);
      }, 500);
    }
  };
  const dispatch = useDispatch();
  const handleAddToCart = (quantity, book) => {
    if (isAuthenticated) {
      if (cartArray.length === 0) {
        // Nếu giỏ hàng trống, thêm sản phẩm mới vào giỏ hàng
        dispatch(doBookAction({ quantity, detail: book, _id: book._id }));
      } else {
        // Kiểm tra xem sản phẩm có cùng ID đã tồn tại trong giỏ hàng chưa
        const existingCartItem = cartArray.find((item) => item.id === book._id);

        if (existingCartItem) {
          // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng thêm số lượng vào tối đa là quantity
          const newQuantity = existingCartItem.quantity + quantity;
          if (newQuantity <= book.quantity) {
            dispatch(
              doUpdateOrder({
                quantity: newQuantity,
                detail: book,
                _id: book._id,
              })
            );
            message.success(`Sản phẩm đã được cập nhật trong giỏ hàng.`);
          } else {
            message.error(`Số lượng sản phẩm vượt quá số lượng có sẵn.`);
          }
        } else {
          // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
          dispatch(doBookAction({ quantity, detail: book, _id: book._id }));
          // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng thêm số lượng vào tối đa là quantity
          const newQuantity = existingCartItem.quantity + quantity;
          if (newQuantity <= book.quantity) {
            dispatch(
              doUpdateOrder({
                quantity: newQuantity,
                detail: book,
                _id: book._id,
              })
            );
            message.success(`Sản phẩm đã được cập nhật trong giỏ hàng.`);
          } else {
            message.error(`Số lượng sản phẩm vượt quá số lượng có sẵn.`);
          }
          message.success(`Sản phẩm đã được thêm vào giỏ hàng.`);
        }
      }
    } else {
      dispatch(doBookAction({ quantity, detail: book, _id: book._id }));
      navigate("/login");
    }
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
                    <button
                      className="cart"
                      onClick={() => handleAddToCart(quantityNumber, dataBook)}
                    >
                      <span>Thêm vào giỏ hàng</span>
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
