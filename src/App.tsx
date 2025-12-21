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
  const [accounts, setaccounts] = useState({ totel: 0, data: [], busy: false });
  const [transactions, settransactions] = useState({
    totel: 0,
    data: [],
    busy: false,
  });
  const [blocks, setblocks] = useState({ totel: 0, data: [], busy: false });

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 5000);
  }, []);

  const apiBase = "https://manoscan-api.vercel.app/api/";
  const loadData = async () => {
    try {
      axios.get(apiBase + "accounts").then((res) => {
        setaccounts({ ...res.data, busy: false });
      });
      axios.get(apiBase + "transactions").then((res) => {
        settransactions({ ...res.data, busy: false });
      });
      axios.get(apiBase + "blocks").then((res) => {
        setblocks({ ...res.data, busy: false });
      });
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <div className="w-screen flex justify-center items-start p-3 gap-3 flex-wrap">
      <div className="w-full max-w-100">
        <div className="text-[28px] font-bold p-1">
          Latest accounts {accounts.busy ? "Loading..." : ""}
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
        <div className="text-[28px] font-bold p-1">
          Latest transactions {transactions.busy ? "Loading..." : ""}
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
          </div>
        ))}
      </div>
      <div className="w-full max-w-100">
        <div className="text-[28px] font-bold p-1">
          Latest blocks {blocks.busy ? "Loading..." : ""}
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
