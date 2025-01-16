import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SizeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SizeGuide = ({ open, onOpenChange }: SizeGuideProps) => {
  const sizeData = [
    { us: "6", uk: "5.5", eu: "38.5", cm: "24" },
    { us: "7", uk: "6.5", eu: "39", cm: "24.5" },
    { us: "8", uk: "7.5", eu: "40", cm: "25" },
    { us: "9", uk: "8.5", eu: "41", cm: "25.5" },
    { us: "10", uk: "9.5", eu: "42", cm: "26" },
    { us: "11", uk: "10.5", eu: "43", cm: "26.5" },
    { us: "12", uk: "11.5", eu: "44", cm: "27" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>CM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeData.map((size) => (
                <TableRow key={size.us}>
                  <TableCell>{size.us}</TableCell>
                  <TableCell>{size.uk}</TableCell>
                  <TableCell>{size.eu}</TableCell>
                  <TableCell>{size.cm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;