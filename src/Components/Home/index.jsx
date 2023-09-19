import React, { useEffect, useState } from "react";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import "./index.scss";
import { Button, Drawer, Form, InputNumber, Pagination } from "antd";
import { Checkbox, Col, Divider, Row } from "antd";
import { callAllBooks, callBookCategory } from "../../service/api";
import { Rate } from "antd";
import { Tabs } from "antd";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
const onChangeTabs = (key) => {
  console.log(key);
};
const items = [
  {
    key: "&sort=-sold",
    label: `Phổ Biến`,
  },
  {
    key: "&sort=-updatedAt",
    label: `Hàng Mới`,
  },
  {
    key: "&sort=price",
    label: `Giá từ Thấp đến Cao`,
  },
  {
    key: "&sort=-price",
    label: `Giá từ Cao đến Thấp`,
  },
];
const Home = () => {
  const [searchTerm, setSearchTerm] = useOutletContext();
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([]);
  const [listBookHome, setListBookHome] = useState([]);
  const [arrFilterCategory, setArrFilterCategory] = useState([]);
  const [filter, setFilter] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setpageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState(`&sort=-sold`);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChangeChecked = (checkedValues) => {
    console.log(checkedValues);
    const fc = checkedValues.join(",");
    setFilter(`&category=${fc}`);
    setArrFilterCategory(checkedValues);
  };
  useEffect(() => {
    getAllCategory();
  }, []);
  useEffect(() => {
    getListBook();
  }, [current, pageSize, total, query, filter, searchTerm]);
  const handleChangeFilter = (changedValues, values) => {
    const range = {
      from: values.from,
      to: values.to,
    };
    const updateValues = {
      ...values,
      range: range,
    };
    console.log(updateValues);
  };
  const getAllCategory = async () => {
    const res = await callBookCategory();
    if (res && res.data && res.data.data) {
      const d = res?.data?.data.map((item) => {
        return { label: item, value: item };
      });
      setListCategory(res.data.data);
    }
  };
  const getListBook = async () => {
    let queryBase = `current=${current}&pageSize=${pageSize}${query}`;
    if (filter) {
      queryBase += `${filter}`;
    }
    if (searchTerm) {
      queryBase += `&mainText=/${searchTerm}/i`;
    }
    const res = await callAllBooks(queryBase);
    // console.log(res);
    if (res && res.data && res.data.result && res.data.meta) {
      setListBookHome(res.data.result);
      setTotal(res.data.meta.total || 0);
    }
  };
  const handleOnChangePage = (pagination, filters, sorter, extra) => {
    console.log(pagination);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setpageSize(pagination.pageSize);
      // getListBook();
    }
  };
  const onFinish = (values) => {
    console.log(values);
    if (values.from >= 0 && values.to >= 0) {
      let f = `&price>=${values.from}&price<=${values.to}`;
      setFilter(f);
    }
  };
  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };
  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
    return str;
  };

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };
  return (
    <div
      className="home"
      style={{
        backgroundColor: "#EFEEF0",
        flexDirection: "row",
        height: "auto",
      }}
    >
      <div
        className="home-container-left"
        style={{
          borderTopRightRadius: "10px",
          width: "20%",
          backgroundColor: "white",
          padding: "10px 5px",
          margin: "20px 5px 0px 0px",
        }}
      >
        <div
          className="filter"
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="filter-icon">
            <FilterOutlined style={{ color: "blue" }} />
            <span>Bộ lọc tìm kiếm</span>
          </div>
          <div>
            <ReloadOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilter("");
                form.resetFields();
                setSearchTerm("");
              }}
            />
          </div>
        </div>
        <Divider />
        <Form
          onFinish={onFinish}
          form={form}
          onValuesChange={(changedValues, values) =>
            handleChangeFilter(changedValues, values)
          }
        >
          <Form.Item name="category">
            <div className="category">
              <span>Danh Mục Sản Phẩm</span>
              <div className="list-category">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  onChange={onChangeChecked}
                >
                  <Row>
                    {listCategory &&
                      listCategory.length > 0 &&
                      listCategory.map((item, index) => {
                        return (
                          <Col
                            span={24}
                            key={index}
                            style={{ padding: "10px 0px" }}
                          >
                            <Checkbox value={item}>{item}</Checkbox>
                          </Col>
                        );
                      })}
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
          </Form.Item>
          <Form.Item name="range">
            <div className="price-range" style={{ paddingTop: "20px" }}>
              <span>Khoảng giá</span>
              <div
                className="range"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                }}
              >
                <Form.Item name="from">
                  <InputNumber min={0} placeholder="Small" />
                </Form.Item>
                -
                <Form.Item name={`to`}>
                  <InputNumber min={0} placeholder="Big" />
                </Form.Item>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "10px",
                }}
              >
                <Button onClick={() => form.submit()} type="primary">
                  Áp dụng
                </Button>
              </div>
              <Divider />
            </div>
          </Form.Item>
        </Form>
        <div
          className="rate"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Rate allowHalf defaultValue={5} />
          <Rate allowHalf defaultValue={4} />
          <Rate allowHalf defaultValue={3} />
          <Rate allowHalf defaultValue={2} />
          <Rate allowHalf defaultValue={1} />
        </div>
      </div>
      <Drawer
        width={"100%"}
        title="Chức năng lọc sản phẩm"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div
          className="filter"
          style={{
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ReloadOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFilter("");
                form.resetFields();
                setSearchTerm("");
              }}
            />
          </div>
        </div>
        <Divider />
        <Form
          onFinish={onFinish}
          form={form}
          onValuesChange={(changedValues, values) =>
            handleChangeFilter(changedValues, values)
          }
        >
          <Form.Item name="category">
            <div className="category">
              <span>Danh muc san pham</span>
              <div className="list-category">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  onChange={onChangeChecked}
                >
                  <Row>
                    {listCategory &&
                      listCategory.length > 0 &&
                      listCategory.map((item, index) => {
                        return (
                          <Col
                            span={24}
                            key={index}
                            style={{ padding: "10px 0px" }}
                          >
                            <Checkbox value={item}>{item}</Checkbox>
                          </Col>
                        );
                      })}
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
          </Form.Item>
          <Row>
            <Form.Item name="range">
              <div className="price-range" style={{ paddingTop: "20px" }}>
                <span>Khoang gia</span>
                <div
                  className="range"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                  }}
                >
                  <Form.Item name="from">
                    <InputNumber placeholder="Small" />
                  </Form.Item>
                  -
                  <Form.Item name={`to`}>
                    <InputNumber placeholder="Big" />
                  </Form.Item>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "10px",
                  }}
                >
                  <Button onClick={() => form.submit()} type="primary">
                    Ap Dung
                  </Button>
                </div>
                <Divider />
              </div>
            </Form.Item>
          </Row>
        </Form>
        <div
          className="rate"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Rate allowHalf defaultValue={5} />
          <Rate allowHalf defaultValue={4} />
          <Rate allowHalf defaultValue={3} />
          <Rate allowHalf defaultValue={2} />
          <Rate allowHalf defaultValue={1} />
        </div>
      </Drawer>
      <div
        className="home-container-right"
        style={{
          flex: 1,
          backgroundColor: "white",
          margin: "20px 0px 0px 10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="home-container-right-header"
          style={{ padding: "10px" }}
        >
          <div
            className="custom-tabs"
            style={{ borderRadius: "5px", backgroundColor: "white" }}
          >
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={(values) => setQuery(values)}
            ></Tabs>
            <div className="filter-icon" onClick={showDrawer}>
              <FilterOutlined style={{ color: "blue" }} />
              <span>Filter </span>
            </div>
            <Row gutter={16}>
              {listBookHome &&
                listBookHome.length > 0 &&
                listBookHome.map((item, index) => {
                  return (
                    <Col key={item.id} span={6} className="book">
                      <div
                        key={item.id}
                        onClick={() => handleRedirectBook(item)}
                        // className="book"
                        style={{
                          border: "1px solid #cccccc",
                          marginRight: "5px",
                        }}
                      >
                        <div>
                          <img
                            src={`
                            ${import.meta.env.VITE_BACKEND_URL}/images/book/${
                              item.thumbnail
                            }`}
                            alt=""
                          />
                        </div>
                        <div className="text" style={{ padding: "10px 0px " }}>
                          {item.mainText}
                        </div>
                        <div className="price" style={{ padding: "10px 0px " }}>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </div>
                        <div
                          className="rating"
                          style={{ padding: "10px 0px " }}
                        >
                          <Rate
                            value={5}
                            disabled
                            style={{ color: "#ffce3d", fontSize: 10 }}
                          />
                          <span>Đã bán {item.sold}</span>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
              }}
            >
              <Pagination
                current={current}
                total={total}
                pageSize={pageSize}
                responsive
                onChange={(p, s) =>
                  handleOnChangePage({ current: p, pageSize: s })
                }
              />
            </div>
          </div>
        </div>
        <div
          className="footer-home-container-right"
          style={{ backgroundColor: "#EFEEF0", width: "100%", height: "auto" }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
