import React from 'react';

const farmers = [
  {
    id: 1,
    name: "Kelompok Tani Rejo Boyolali",
    details: "Jarak: 18 Km • 200Kg Bawang & Kubis Ready",
    ledgerId: "#BC-83921",
    price: "Rp 18.000/kg",
    icon: "tractor"
  },
  {
    id: 2,
    name: "Peternak Mandiri Karanganyar",
    details: "Jarak: 22 Km • 500Kg Karkas Ayam Fresh",
    ledgerId: "#BC-22839",
    price: "Rp 32.000/kg",
    icon: "cow"
  }
];

const transactions = [
  {
    id: 1,
    title: "Pengadaan Bahan Menu MBG 1000 Porsi",
    txId: "0x47a1...8b9c",
    date: "25-06-2026",
    value: "Rp 7.500.000",
    status: "VERIFIED"
  },
  {
    id: 2,
    title: "Pengiriman Sampah Organik ke Mitra Kompos",
    txId: "0x932b...99ee",
    date: "24-06-2026",
    value: "150 Kg",
    status: "VERIFIED"
  }
];

export default function LedgerBcScreen({ onBackToHome }) {
  return (
    <section id="screen-blockchain" className="p-4 space-y-5 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackToHome} 
          className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full transition-all-300 cursor-pointer h-10 w-10 flex items-center justify-center border border-slate-100"
          title="Kembali ke Beranda"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Blockchain Supply Matchmaker</h2>
          <p className="text-xs text-slate-500">Cegah korupsi, potong tengkulak, bantu petani lokal</p>
        </div>
      </div>

      {/* Blockchain verified farmer matching map simulation */}
      <div className="bg-emerald-50/60 rounded-3xl p-4 border border-emerald-100/50 space-y-3.5 shadow-xs">
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1">
            <i className="fa-solid fa-link"></i> BLOCKCHAIN VERIFIED
          </span>
          <span className="text-xs font-extrabold text-emerald-800">4 Petani Lokal Terdeteksi</span>
        </div>

        {/* Simulation cards representation */}
        <div className="space-y-3">
          {farmers.map(farmer => (
            <div 
              key={farmer.id}
              className="bg-white rounded-2xl border border-emerald-100 p-3.5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 shadow-xs hover:border-emerald-200 transition-all-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-105 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg shadow-2xs shrink-0 border border-emerald-100">
                  <i className={`fa-solid fa-${farmer.icon}`}></i>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-850">{farmer.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{farmer.details}</p>
                  <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block font-mono">
                    Ledger ID: {farmer.ledgerId}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-800 self-end xs:self-auto bg-emerald-50/50 px-2.5 py-1 rounded-xl border border-emerald-100">
                {farmer.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Block Transaction History */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">Histori Ledger Blockchain & Transparansi</h3>
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {transactions.map(tx => (
            <div 
              key={tx.id} 
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm flex justify-between items-center text-xs hover:bg-slate-50/50 transition-all-300"
            >
              <div className="space-y-1">
                <p className="font-extrabold text-slate-800 leading-tight">{tx.title}</p>
                <p className="text-[9px] text-slate-400 font-mono">TxID: {tx.txId} | {tx.date}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-emerald-700 font-black block">{tx.value}</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black tracking-wider shadow-2xs mt-1 inline-block">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
