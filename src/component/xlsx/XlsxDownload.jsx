// import XLSX from "xlsx"
import * as XLSX from "xlsx/xlsx.mjs";

const XlsxDownload = ({ data }) => {
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();

    // Convert array of objects to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate and save the Excel file
    XLSX.writeFile(wb, "arbitaryPointsheet.xlsx");
  };
  return (
    <div>
      <button onClick={handleDownload}>Download Data</button>
    </div>
  );
};

export default XlsxDownload;
