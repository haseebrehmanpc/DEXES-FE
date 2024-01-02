// import XLSX from "xlsx"
import * as XLSX from "xlsx/xlsx.mjs";
var Heading = [
  ["Spread", "Site(high)", "Site(low)", "highest Bid", "Lowest Ask", "Asset"],
];
const XlsxDownload = ({ data }) => {
  const handleDownload = () => {
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, data, { origin: "A2", skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "arbitaryPointsheet.xlsx");
  };
  return (
    <div>
      <button onClick={handleDownload}>Download Data</button>
    </div>
  );
};

export default XlsxDownload;
