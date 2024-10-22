import { Combobox } from "@/Components/ui/combobox";
import { GenerateItemsOptions } from "@/Data/items";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";

const item_options = GenerateItemsOptions();

export const Test = () => {
  return (
    <div className="w-full h-full bg-white">
      <p>VitualTest</p>
      <Combobox
        data={item_options}
        width={400}
        height={400}
        placeholder="Select Item...."
      />
    </div>
  );
};

export const VirtualizedListTest = () => {
  const parentRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!query) return item_options;
    return item_options.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  return (
    <div className="relative">
      <p onClick={() => setOpen(true)}>
        {selectedValue ? "Selected Value" : "No Selected Value"}
      </p>

      {open && (
        <div className="absolute top-0 left-0">
          <input onChange={(e) => setQuery(e.currentTarget.value)} />
          <div
            ref={parentRef}
            style={{
              height: "200px",
              width: "400px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                position: "relative",
                width: "100%",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((vItem) => (
                <div
                  key={vItem.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${vItem.size}px`,
                    transform: `translateY(${vItem.start}px)`,
                  }}
                >
                  {filteredItems[vItem.index].label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
