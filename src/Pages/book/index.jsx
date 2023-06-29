import React, { useEffect, useState } from "react";
import SearchBook from "./SearchBook";
import TableBook from "./TableBook";
import { callAllBooks } from "../../service/api";
import { Form } from "antd";
import ShowDetailBook from "./ShowDetailBook";
import ModalCreateBook from "./ModalCreateBook";
import ModalUpdateBook from "./ModalUpdateBook";

const BookPage = () => {
  const [formSubmitSearch] = Form.useForm();
  const [formSubmitCreateBook] = Form.useForm();
  const [formSubmitUpdateBook] = Form.useForm();
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [dataDetailBook, setDataDetailBook] = useState([]);
  const [dataUpdateBook, setDataUpdateBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(`current=${current}&pageSize=${pageSize}`);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalCreateBook, setOpenModalCreateBook] = useState(false);
  const [openModalUpdateBook, setOpenModalUpdateBook] = useState(false);
  const getAllBooks = async () => {
    setIsLoading(true);
    const res = await callAllBooks(query);
    if (res && res.data && res.data.result) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  const handleOpenBtnModalCreateBook = () => {
    setOpenModalCreateBook(true);
  };
  const handleOpenBtnModalUpdateBook = () => {
    setOpenModalUpdateBook(true);
  };
  const handleCloseBtnModalCreateBook = () => {
    setOpenModalCreateBook(false);
    formSubmitCreateBook.resetFields();
  };
  const handleCloseBtnModalUpdateBook = () => {
    setOpenModalUpdateBook(false);
    formSubmitUpdateBook.resetFields();
  };
  const handleSubmitCreateBook = (values) => {
    formSubmitCreateBook.submit();
    setOpenModalCreateBook(false);
  };
  const handleShowDrawer = () => {
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const handleSubmiteSearch = async (values) => {
    let newQuery = "";
    if (values.mainText) {
      newQuery = query + `&mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      newQuery = query + `&author=/${values.author}/i`;
    }
    if (values.category) {
      newQuery = query + `&category=/${values.category}/i`;
    }
    if (values.mainText && values.category) {
      newQuery =
        query +
        `&mainText=/${values.mainText}/i&category=/${values.category}/i`;
    }
    if (values.mainText && values.author) {
      newQuery =
        query + `&mainText=/${values.mainText}/i&author=/${values.author}/i`;
    }
    if (values.category && values.author) {
      newQuery =
        query + `&category=/${values.category}/i&author=/${values.author}/i`;
    }
    if (values.mainText && values.category && values.author) {
      newQuery =
        query +
        `&mainText=/${values.mainText}/i&category=/${values.category}/i&author=/${values.author}/i`;
    }
    setQuery(newQuery);
    if (newQuery !== "") {
      setIsLoading(true);
      const res = await callAllBooks(newQuery);
      if (res.data) {
        setListBook(res.data.result);
        setTotal(res.data.meta.total);
      }
      setIsLoading(false);
    }
  };
  const handleClear = () => {
    formSubmitSearch.resetFields();
    const emptyQuery = `current=${current}&pageSize=${pageSize}`;
    if (query !== emptyQuery) {
      setQuery(emptyQuery);
    }
  };
  useEffect(() => {
    getAllBooks();
  }, [query]);
  return (
    <div>
      <div>
        <SearchBook
          form={formSubmitSearch}
          handleClear={handleClear}
          handleSubmiteSearch={handleSubmiteSearch}
          getAllBooks={getAllBooks}
        />
      </div>
      <div>
        <TableBook
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          getAllBooks={getAllBooks}
          listBook={listBook}
          current={current}
          setCurrent={setCurrent}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
          setTotal={setTotal}
          handleCloseDrawer={handleCloseDrawer}
          handleShowDrawer={handleShowDrawer}
          setDataDetailBook={setDataDetailBook}
          handleOpenBtnModalCreateBook={handleOpenBtnModalCreateBook}
          handleOpenBtnModalUpdateBook={handleOpenBtnModalUpdateBook}
          setDataUpdateBook={setDataUpdateBook}
        />
      </div>
      <div>
        <ShowDetailBook
          dataDetailBook={dataDetailBook}
          handleCloseDrawer={handleCloseDrawer}
          handleShowDrawer={handleShowDrawer}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
        />
      </div>
      <div>
        <ModalCreateBook
          getAllBooks={getAllBooks}
          form={formSubmitCreateBook}
          handleSubmitCreateBook={handleSubmitCreateBook}
          openModalCreateBook={openModalCreateBook}
          handleCloseBtnModalCreateBook={handleCloseBtnModalCreateBook}
        />
      </div>
      <div>
        <ModalUpdateBook
          dataUpdateBook={dataUpdateBook}
          getAllBooks={getAllBooks}
          form={formSubmitUpdateBook}
          handleSubmitCreateBook={handleSubmitCreateBook}
          openModalUpdateBook={openModalUpdateBook}
          handleCloseBtnModalUpdateBook={handleCloseBtnModalUpdateBook}
        />
      </div>
    </div>
  );
};

export default BookPage;
