import DataTable from "react-data-table-component";

function Table({ columns, data }) {
  return (
    <div>
      <p>Table</p>
      <DataTable columns={columns} data={data} pagination />
    </div>
  );
}

export default Table;
