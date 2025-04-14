import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

interface Props<ColumnKeys extends string> {
  columns: Record<ColumnKeys, string | boolean | number>;
  values: Array<Record<ColumnKeys, string | boolean | number>>;
}

const PayoutBreakdownTable = <ColumnKeys extends string>({
  columns,
  values,
}: Props<ColumnKeys>) => {
  console.log(values);
  return (
    <>
      <p className="mb-2 text-neutral-400">Total Records: {values.length}</p>

      <div className="max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {(Object.keys(columns) as ColumnKeys[]).map((column) => (
                <TableHead key={column} className="sticky top-0 bg-white z-10">
                  {columns[column]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {values.length === 0 && <TableCaption>- No Records -</TableCaption>}
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
      </div>
    </>
  );
};

export default PayoutBreakdownTable;
