import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col } from "antd";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();

  // useEffect for fetching items
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    };
    getAllItems();
  }, [dispatch]);

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "32px" }}>
          รายการสินค้าทั้งหมด
        </h1>
        <Row gutter={[24, 24]}>
          {itemsData.map((item) => (
            <Col xs={24} lg={6} md={12} sm={12} key={item._id}>
              <ItemList item={item} />
            </Col>
          ))}
        </Row>
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
