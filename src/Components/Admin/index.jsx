import { Card, Col, Row, Statistic } from "antd";
import { callGetDashBoard } from "../../service/api";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
const AdminComponent = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const getDashBoard = async () => {
    const res = await callGetDashBoard();
    console.log("🚀 ~ file: index.jsx:10 ~ getDashBoard ~ res:", res);
    console.log(res);
    if (res && res.data && res.data.data) {
      setTotalOrder(res.data.data.countOrder);
      setTotalUser(res.data.data.countUser);
    }
  };
  const formatterUser = (totalUser) => (
    <CountUp end={totalUser} separator="," />
  );
  const formatterOrder = (totalOrder) => (
    <CountUp end={totalOrder} separator="," />
  );
  useEffect(() => {
    getDashBoard();
  }, []);
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Tổng User" bordered={false}>
          {/* {totalUser} */}
          <Statistic
            value={totalUser}
            precision={1}
            formatter={formatterUser}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Tổng Order" bordered={false}>
          <Statistic
            value={totalOrder}
            precision={1}
            formatter={formatterOrder}
          />
        </Card>
      </Col>
    </Row>
  );
};
export default AdminComponent;
