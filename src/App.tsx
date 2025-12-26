import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "./App.css";

function showHex(hash: string) {
  if (!hash) return "";
  return (
    <span className="text-[#63beed] font-bold">
      {hash.slice(0, 12) + " ... " + hash.slice(-12)}
    </span>
  );
}

function App() {
  const [accounts, setaccounts] = useState({
    totel: 0,
    data: [],
    busy: true,
    updatedAt: "",
  });
  const [transactions, settransactions] = useState({
    totel: 0,
    data: [],
    busy: true,
    updatedAt: "",
  });
  const [blocks, setblocks] = useState({
    totel: 0,
    data: [],
    busy: true,
    updatedAt: "",
  });
  const [utc, setutc] = useState("");

  useEffect(() => {
    loadAccounts();
    loadTransactions();
    loadBlocks();
    // setInterval(() => {
    //   loadData();
    // }, 5000);
    setInterval(() => {
      const now = new Date();
      setutc(now.toISOString().slice(0, 19));
    }, 1000);
  }, []);

  useEffect(() => {
    // const ws = new WebSocket("ws://localhost:4511");
    const ws = new WebSocket("wss://manoscan-api.vercel.app");

    ws.onopen = () => {};

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.msg === "block_added") {
        loadAccounts();
        loadBlocks();
      }
      if (data.msg === "txn_added") {
        loadAccounts();
        loadTransactions();
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("Disconnected");

    return () => ws.close();
  }, []);

  const apiBase = "https://manoscan-api.vercel.app/api/";
  // const apiBase = "http://localhost:4511/api/";
  const loadAccounts = async () => {
    try {
      axios.get(apiBase + "accounts").then((res) => {
        setaccounts({
          ...res.data,
          busy: false,
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (err) {}
  };
  const loadTransactions = async () => {
    try {
      axios.get(apiBase + "transactions").then((res) => {
        settransactions({
          ...res.data,
          busy: false,
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (err) {}
  };
  const loadBlocks = async () => {
    try {
      axios.get(apiBase + "blocks").then((res) => {
        setblocks({
          ...res.data,
          busy: false,
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (err) {}
  };

  return (
    <div>
      <div className="text-center pt-4">UTC Time:&nbsp;{utc}</div>
      <div className="w-screen flex justify-center items-start px-3 pb-3 gap-3 flex-wrap">
        <div className="w-full max-w-100">
          <div className="p-1">
            <span className="text-[28px] font-bold">Latest accounts</span>{" "}
            {accounts.busy ? "Loading..." : ""}
            <div className="text-sm">
              Updated At:&nbsp;{accounts.updatedAt.slice(0, 19)}
            </div>
          </div>
          {accounts.data.map((it: any, k) => (
            <div
              key={k}
              className="border border-gray-400 m-1 p-2 text-sm rounded"
            >
              <div>Address: {showHex(it?.a)}</div>
              <div>
                Balance:&nbsp;
                <span className="text-[#a0aeco]">
                  {/* {Number(ethers.formatEther(it?.b || "0n")).toLocaleString()}{" "} */}
                  {ethers.formatEther(it?.b || "0n")}&nbsp;MANO
                </span>
              </div>
              <div>
                Txn Count: <span className="text-[#63beed]">{it?.n}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full max-w-100">
          <div className="p-1">
            <span className="text-[28px] font-bold">Latest transactions</span>{" "}
            {transactions.busy ? "Loading..." : ""}
            <div className="text-sm">
              Updated At:&nbsp;{transactions.updatedAt.slice(0, 19)}
            </div>
          </div>
          {transactions.data.map((it: any, k) => (
            <div
              key={k}
              className="border border-gray-400 m-1 p-2 text-sm rounded"
            >
              <div>Hash: {showHex(it?.th)}</div>
              <div>From: {showHex(it?.f)}</div>
              <div>To: {showHex(it?.t)}</div>
              <div>Value: {ethers.formatEther(it?.v || "0n")}&nbsp;MANO</div>
              <div>Estimat Gas: {ethers.formatEther(it?.gu || "0n")}</div>
              <div>Block: {it?.bn}</div>
              <div>Time: {new Date(it?.ts || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="w-full max-w-100">
          <div className="p-1">
            <span className="text-[28px] font-bold">Latest blocks</span>{" "}
            {blocks.busy ? "Loading..." : ""}
            <div className="text-sm">
              Updated At:&nbsp;{blocks.updatedAt.slice(0, 19)}
            </div>
          </div>
          {blocks.data.map((it: any, k) => (
            <div
              key={k}
              className="border border-gray-400 m-1 p-2 text-sm rounded"
            >
              <div>Block Number: {it?.bn}</div>
              <div>Block Hash: {showHex(it?.bh)}</div>
              <div>Parent Hash: {showHex(it?.ph)}</div>
              <div>Balance: {ethers.formatEther(it?.bu || "0x0")}</div>
              <div>Txn Count: {it?.txns?.length}</div>
              <div>Time: {new Date(it?.ts || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
