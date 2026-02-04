import * as XLSX from 'xlsx';

export const exportToExcel = (workers, month) => {
  // ডাটা ফরম্যাট করা
  const data = workers.map((w, index) => ({
    "ক্রমিক নং": index + 1,
    "নাম": w.name,
    "পদবি": w.position,
    "মূল বেতন": w.basicSalary,
    "কাজের দিন": w.days,
    "ভাতা": w.allowance,
    "অ্যাডভান্স": w.advance,
    "নিট বেতন": w.netSalary
  }));

  // ওয়ার্কশিট তৈরি
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Sheet");

  // ফাইল ডাউনলোড (ফাইলের নাম মাসের নাম অনুযায়ী হবে)
  XLSX.writeFile(workbook, `Salary_Sheet_${month}.xlsx`);
};

