import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [wallets, setwallets] = useState({ totel: 0, data: [], busy: false });
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
      axios.get(apiBase + "wallets").then((res) => {
        setwallets({ ...res.data, busy: false });
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
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 20,
        boxSizing: "border-box",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 300 }}>
        <h2>Latest Wallets {wallets.busy ? "Loading..." : ""}</h2>
        {wallets.data.map((it: any, k) => (
          <div
            key={k}
            style={{
              border: "1px solid gray",
              margin: 5,
              padding: 5,
              fontSize: 14,
            }}
          >
            <div>Address: {it?.a}</div>
            <div style={{ fontWeight: "bold" }}>
              Balance: {ethers.formatEther(it?.b || "0n")}
            </div>
          </div>
        ))}
      </div>
      <div style={{ minWidth: 300 }}>
        <h2>Latest transactions {transactions.busy ? "Loading..." : ""}</h2>
        {transactions.data.map((it: any, k) => (
          <div
            key={k}
            style={{
              border: "1px solid gray",
              margin: 5,
              padding: 5,
              fontSize: 14,
            }}
          >
            <div>Hash: {it?.th}</div>
            <div>From: {it?.f}</div>
            <div>To: {it?.t}</div>
            <div>Value: {ethers.formatEther(it?.v || "0n")}</div>
            <div>Estimat Gas: {ethers.formatEther(it?.gu || "0n")}</div>
          </div>
        ))}
      </div>
      <div style={{ minWidth: 300 }}>
        <h2>Latest blocks {blocks.busy ? "Loading..." : ""}</h2>
        {blocks.data.map((it: any, k) => (
          <div
            key={k}
            style={{
              border: "1px solid gray",
              margin: 5,
              padding: 5,
              fontSize: 14,
            }}
          >
            <div>Block Number: {it?.bn}</div>
            <div>Block Hash: {it?.bh}</div>
            {/* <div>Balance: {ethers.formatEther(it?.b)}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
