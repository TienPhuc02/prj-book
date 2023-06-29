import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const ResultOrder = () => {
  const navigate = useNavigate();
  return (
    <Result
      icon={<SmileOutlined />}
      title="Đơn hàng đã được đặt thành công"
      extra={
        <Button type="primary" onClick={() => navigate("/historyorder")}>
          Xem Lịch sử
        </Button>
      }
    />
  );
};
export default ResultOrder;
