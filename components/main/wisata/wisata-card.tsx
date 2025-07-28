import Image from "next/image";
import { WisataItem } from "@/types/wisata";
import { Button } from "@/components/ui/button";

export default function WisataCard({
  item,
  onClick,
}: {
  item: WisataItem;
  onClick: () => void;
}) {
  return (
    <div className="group rounded-xl border bg-white shadow-sm dark:bg-neutral-900 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
      <div className="overflow-hidden">
        <Image
          src={item.gambar}
          alt={item.nama}
          width={600}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-125 transition-all duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{item.nama}</h3>
        <p className="text-sm text-muted-foreground">{item.deskripsi}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-800 dark:bg-neutral-800 dark:text-white">
            {item.kategori}
          </span>
          <Button
            variant="outline"
            className="text-[#A80038] border-[#A80038] hover:bg-[#A80038] hover:text-white"
            onClick={onClick}
          >
            Lihat Selengkapnya
          </Button>
        </div>
      </div>
    </div>
  );
}