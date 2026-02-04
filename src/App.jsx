import React, { useState, useEffect } from "react";
import { LogOut, Plus, Trash2, Edit3, Download, FileSpreadsheet } from "lucide-react";
import html2pdf from "html2pdf.js";
import * as XLSX from 'xlsx';
import Login from "./components/Login";
import { exportToExcel } from "./utils/exportExcel";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true")
  const [company, setCompany] = useState("এম ডি আল হাকাম")
  const [month, setMonth] = useState("জানুয়ারি")
  const [totalDays, setTotalDays] = useState(31)
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem("workers")
    return saved ? JSON.parse(saved) : []
  })

  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [basicSalary, setBasicSalary] = useState("")
  const [days, setDays] = useState("")
  const [allowance, setAllowance] = useState("")
  const [advance, setAdvance] = useState("")
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    localStorage.setItem("workers", JSON.stringify(workers))
  }, [workers])

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  const addWorker = () => {
    if (!name || !basicSalary || !days) {
        alert("দয়া করে নাম, বেতন এবং দিন ইনপুট দিন");
        return;
    }
    
    const daily = Number(basicSalary) / Number(totalDays)
    const net = Math.round((daily * Number(days)) + Number(allowance || 0) - Number(advance || 0))
    
    const worker = { 
        name, 
        position, 
        basicSalary: Number(basicSalary), 
        days: Number(days), 
        allowance: Number(allowance || 0), 
        advance: Number(advance || 0), 
        netSalary: net 
    }

    if (editIndex !== null) {
      const list = [...workers]
      list[editIndex] = worker
      setWorkers(list)
      setEditIndex(null)
    } else { 
      setWorkers([...workers, worker]) 
    }
    resetForm()
  }

  const resetForm = () => { 
    setName(""); setPosition(""); setBasicSalary(""); 
    setDays(""); setAllowance(""); setAdvance(""); 
    setEditIndex(null) 
  }

  const deleteWorker = (index) => {
    if(window.confirm("আপনি কি নিশ্চিতভাবে এটি মুছতে চান?")) {
        setWorkers(workers.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-10 font-sans">
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-6 rounded-b-[40px] shadow-lg mb-6">
        <div className="flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">{company}</h1>
            <button 
                onClick={() => {localStorage.removeItem("loggedIn"); setLoggedIn(false)}}
                className="text-white bg-red-500/20 px-3 py-1 rounded-lg text-xs"
            >লগ আউট</button>
        </div>
        <p className="text-blue-100 text-center text-sm opacity-80 mt-2">স্যালারি ম্যানেজমেন্ট ড্যাশবোর্ড</p>
      </div>

      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex justify-between items-center border border-indigo-50">
           <div>
             <p className="text-xs text-slate-400 uppercase tracking-wider">চলতি মাস</p>
             <input value={month} onChange={(e) => setMonth(e.target.value)} className="font-bold text-slate-700 w-24 outline-none border-b border-transparent focus:border-indigo-300" />
           </div>
           <button 
             onClick={() => exportToExcel(workers, month)}
             className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 active:scale-95 transition"
           >
             <FileSpreadsheet size={16} /> এক্সেল
           </button>
        </div>

        <h2 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
           <span className="w-2 h-6 bg-indigo-600 rounded-full"></span> শ্রমিক তালিকা ({workers.length})
        </h2>
        
        <div className="space-y-4 mb-10">
          {workers.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400">কোন শ্রমিক যুক্ত করা হয়নি</p>
            </div>
          ) : (
            workers.map((w, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-extrabold text-slate-800 text-lg">{w.name}</p>
                    <p className="text-sm text-indigo-500 font-medium">{w.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">নিট বেতন</p>
                    <p className="font-black text-emerald-600 text-xl">৳{w.netSalary}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-50">
                  <button onClick={() => { 
                    setName(w.name); setPosition(w.position); setBasicSalary(w.basicSalary); 
                    setDays(w.days); setAllowance(w.allowance); setAdvance(w.advance); setEditIndex(i); 
                    window.scrollTo({top: 0, behavior: 'smooth'})
                  }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1"><Edit3 size={14}/> এডিট</button>
                  <button onClick={() => deleteWorker(i)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1"><Trash2 size={14}/> মুছুন</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-[30px] shadow-xl border border-indigo-100">
          <h2 className="font-black text-xl text-slate-800 mb-5 text-center">
            {editIndex !== null ? "📝 তথ্য সংশোধন" : "➕ নতুন শ্রমিক"}
          </h2>
          <div className="space-y-3">
            <input placeholder="নাম" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input placeholder="পদবি" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] ml-2 text-slate-400 font-bold uppercase">মূল বেতন</label>
                <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] ml-2 text-slate-400 font-bold uppercase">কাজের দিন</label>
                <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="ভাতা" value={allowance} onChange={(e) => setAllowance(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl outline-none" />
              <input type="number" placeholder="অ্যাডভান্স" value={advance} onChange={(e) => setAdvance(e.target.value)} className="bg-slate-50 border-none p-4 rounded-2xl outline-none" />
            </div>

            <button onClick={addWorker} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 mt-4 active:scale-95 transition">
              {editIndex !== null ? "আপডেট করুন" : "সেভ করুন"}
            </button>
            {editIndex !== null && <button onClick={resetForm} className="w-full text-slate-400 py-2 text-sm font-bold">বাতিল করুন</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

