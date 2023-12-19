"use client";

import Table from "@/component/table";
import { useState, useEffect, useRef } from "react";

export default function MainPage() {
  const [data, setData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = "ws://localhost:3003/";

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("websocket opened");
      socketRef.current.send(
        JSON.stringify({
          type: "market_liquidity",
          data: {
            coin: "BTC",
          },
        })
      );

    
    };
    socketRef.current.onmessage = (event) => {
      console.log({ event });
      const parsedData = JSON.parse(event.data);
      setData((prev) => [parsedData, ...prev]);
    };

    // Cleanup the socket when the component unmounts
    return () => {
      console.log("runing cleanup");
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

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
      name: "Site",
      selector: (row) => row.dataOf,
    },
  ];

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}
