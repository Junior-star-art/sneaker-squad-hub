import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SizeGuideTableProps {
  category: "men" | "women" | "kids";
}

export const SizeGuideTable = ({ category }: SizeGuideTableProps) => {
  const sizeGuides = {
    men: {
      headers: ["US", "UK", "EU", "CM"],
      sizes: [
        ["7", "6", "40", "25"],
        ["8", "7", "41", "26"],
        ["9", "8", "42", "27"],
        ["10", "9", "43", "28"],
        ["11", "10", "44", "29"],
        ["12", "11", "45", "30"],
      ],
    },
    women: {
      headers: ["US", "UK", "EU", "CM"],
      sizes: [
        ["5", "3", "36", "22"],
        ["6", "4", "37", "23"],
        ["7", "5", "38", "24"],
        ["8", "6", "39", "25"],
        ["9", "7", "40", "26"],
        ["10", "8", "41", "27"],
      ],
    },
    kids: {
      headers: ["US", "UK", "EU", "CM"],
      sizes: [
        ["1", "13", "32", "19"],
        ["2", "1", "33", "20"],
        ["3", "2", "34", "21"],
        ["4", "3", "35", "22"],
        ["5", "4", "36", "23"],
        ["6", "5", "37", "24"],
      ],
    },
  };

  const guide = sizeGuides[category];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {guide.headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {guide.sizes.map((size, index) => (
            <TableRow key={index}>
              {size.map((value, valueIndex) => (
                <TableCell key={valueIndex}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};