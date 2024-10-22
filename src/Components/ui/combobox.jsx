import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GenerateItemsOptions } from "@/Data/items";
import { useVirtualizer } from "@tanstack/react-virtual";
import { filter, over, transform } from "lodash";

export function Combobox({
  data = [],
  width = 400,
  height = 200,
  placeholder = "Select Data....",
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [query, setQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!query) return data;
    return data.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  React.useEffect(() => {
    rowVirtualizer.measure();
  }, [open, rowVirtualizer, filteredData]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between`}
          style={{ width: `${width}px` }}
        >
          {value
            ? data.find((item) => item.value === value).label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 "
        style={{
          width: `${width}px`,
        }}
      >
        <Command className="bg-red-500" shouldFilter={false}>
          <CommandInput
            placeholder={"Search..."}
            value={query}
            onValueChange={(value) => setQuery(value)}
          />
          <CommandList
            style={{
              height: `${height}px`,
              overflow: "hidden",
            }}
          >
            {filteredData.length === 0 && (
              <CommandEmpty>No data found.</CommandEmpty>
            )}
            {filteredData.length > 0 && (
              <CommandGroup
                ref={parentRef}
                style={{
                  height: `${height}px`,
                  overflow: "auto",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.totalSize}px`,
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <CommandItem
                      key={virtualItem.key}
                      value={filteredData[virtualItem.index].value}
                      onSelect={(currentValue) => {
                        setValue(filteredData[virtualItem.index].value);
                        setOpen(false);
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      {/* <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  /> */}
                      {filteredData[virtualItem.index].label}
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
