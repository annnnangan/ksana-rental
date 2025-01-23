import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props<ColumnKeys extends string> {
  columns: Record<ColumnKeys, string | boolean | number>;
  values: Array<Record<ColumnKeys, string | boolean | number>>;
}

const PayoutBreakdownTable = <ColumnKeys extends string>({
  columns,
  values,
}: Props<ColumnKeys>) => {
  return (
    <>
      <p className="mb-2 text-neutral-400">Total Records: {values.length}</p>
      <Table>
        <TableHeader>
          <TableRow>
            {(Object.keys(columns) as ColumnKeys[]).map((column) => (
              <TableHead key={column} className="min-w-fit text-nowrap">
                {columns[column]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((value, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              {(Object.keys(value) as ColumnKeys[]).map((key) => (
                <TableCell key={key}>{value[key].toString()}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PayoutBreakdownTable;
