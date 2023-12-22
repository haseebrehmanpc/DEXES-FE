"use client";

import Table from "@/component/table";
import { useState, useEffect, useRef } from "react";
import DropDown from "../dropDown";
import { allAssets } from "@/constant/assets";

export default function MainPage() {
  const [data, setData] = useState([]);
  const [socketOpen, setSocketOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = "ws://dexes-server.onrender.com/";

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("websocket opened");
      setSocketOpen(true);
    };
    socketRef.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData((prev) => [parsedData, ...prev]);
    };

    // Cleanup the socket when the component unmounts
    return () => {
      console.log("runing cleanup", socketRef?.current?.readyState === 1);
      if (socketRef?.current) {
        socketRef.current.close();
        setSocketOpen(false);
      }
    };
  }, []);

  const dropDownHandler = (value) => {
    setData([]);
    if (socketOpen && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "custom_market_liquidity",
          data: {
            coin: value,
          },
        })
      );
    }
  };

  const columns = [
    {
      name: "High",
      selector: (row) => row.high,
    },
    {
      name: "Low",
      selector: (row) => row.low,
    },
    {
      name: "Spread %",
      selector: (row) => row.spread,
    },
    {
      name: "highOnSite",
      selector: (row) => row.highOnSite,
    },
    {
      name: "lowOnSite",
      selector: (row) => row.lowOnSite,
    },
  ];

  return (
    <div>
      <DropDown options={allAssets} onSelect={dropDownHandler} />
      <Table columns={columns} data={data} pagination />
    </div>
  );
}
