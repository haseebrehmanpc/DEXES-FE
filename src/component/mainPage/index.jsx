"use client";

import Table from "@/component/table";
import { useState, useEffect, useRef } from "react";
import DropDown from "../dropDown";
import XlsxDownload from "../xlsx/XlsxDownload";
// import { allAssets } from "@/constant/assets";
const noOfAssets = [5, 10, 20];
export default function MainPage() {
  const [data, setData] = useState([]);
  const [socketOpen, setSocketOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("websocket opened");
      setSocketOpen(true);
      socketRef.current.send(
        JSON.stringify({
          type: "custom_market_liquidity",
          data: {
            coin: "all",
          },
        })
      );
    };
    socketRef.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      setData((prev) => [...parsedData]);
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
    setCoin(value);
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

  const clickHandler = () => {
    setData([]);
    if (socketOpen && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "custom_market_liquidity",
          data: {
            coin: "all",
          },
        })
      );
    }
  };

  const columns = [
    {
      name: "Asset ",
      selector: (row) => row.symbol,
    },
    {
      name: "Highest Bid",
      selector: (row) => row.high + `(${row.highOnSite})`,
    },
    {
      name: "Lowest Ask",
      selector: (row) => row.low + `(${row.lowOnSite})`,
    },
    {
      name: "Spread %",
      selector: (row) => row.spread,
    },
  ];

  return (
    <div>
      <XlsxDownload data={data} />
      {/* <DropDown options={noOfAssets} onSelect={dropDownHandler} /> */}
      {/* <button onClick={clickHandler}>Get Data</button> */}
      <Table columns={columns} data={data} pagination />
    </div>
  );
}
