"use client";

import Table from "@/component/table";
import { useState, useEffect, useRef } from "react";
import DropDown from "../dropDown";
import { allAssets } from "@/constant/assets";

export default function MainPage() {
  const [data, setData] = useState([]);
  const [coin , setCoin] = useState('');
  const [socketOpen, setSocketOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = "wss://dexes-server.onrender.com/";

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("websocket opened");
      setSocketOpen(true);
    };
    socketRef.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData((prev) => [parsedData]);
      // setData((prev) => [parsedData, ...prev]);
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
    setCoin(value)
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
      name: "Asset ",
      selector: (row) => coin,
    },
    {
      name: "Highest Bid",
      selector: (row) => row.high + `(${row.highOnSite})`,
    },
    {
      name: "Lowest Ask",
      selector: (row) => row.low  + `(${row.lowOnSite})`,
    },
    {
      name: "Spread %",
      selector: (row) => row.spread,
    },

  ];

  return (
    <div>
      <DropDown options={allAssets} onSelect={dropDownHandler} />
      <Table columns={columns} data={data} pagination />
    </div>
  );
}
