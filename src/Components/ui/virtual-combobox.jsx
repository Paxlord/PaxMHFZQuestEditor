import React, { useRef, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, X } from "lucide-react";

export const VirtualCombobox = ({
  items = [],
  placeholder = "Select an item...",
  maxHeight = 200,
  width = 400,
  onSelect = (item) => {},
  initialValue = null,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef(null);
  const parentRef = useRef(null);
  const containerRef = useRef(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  // Handle click outside to close dropdown
  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }, []);

  // Add and remove click outside listener
  React.useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(filteredItems[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setHighlightedIndex(-1);
          break;
        case "Tab":
          setOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [open, highlightedIndex, filteredItems]
  );

  // Handle item selection
  const handleSelect = useCallback(
    (item) => {
      setSelectedValue(item);
      setQuery("");
      setOpen(false);
      setHighlightedIndex(-1);
      onSelect(item);
    },
    [onSelect]
  );

  // Clear selection
  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedValue(null);
      setQuery("");
      onSelect(null);
    },
    [onSelect]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      <div
        onClick={() => {
          setOpen(!open);
          if (!open) {
            inputRef.current?.focus();
          }
        }}
        className={`
          flex items-center justify-between w-full p-2 border rounded-md 
          bg-white cursor-pointer hover:border-blue-500 
          ${open ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}
        `}
      >
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="w-full outline-none border-none focus:ring-0"
            placeholder={placeholder}
            autoComplete="off"
          />
        ) : (
          <span className={`${!selectedValue ? "text-gray-500" : ""}`}>
            {selectedValue ? selectedValue.label : placeholder}
          </span>
        )}
        <div className="flex items-center gap-2">
          {selectedValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {open && (
        <div
          ref={parentRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{
            height: `${Math.min(maxHeight, rowVirtualizer.totalSize)}px`,
            width,
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = filteredItems[virtualRow.index];
              const isHighlighted = virtualRow.index === highlightedIndex;
              const isSelected = selectedValue?.value === item.value;

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`
                    px-4 py-2 cursor-pointer flex items-center
                    ${isHighlighted ? "bg-blue-50" : "hover:bg-gray-50"}
                    ${isSelected ? "bg-blue-100 hover:bg-blue-100" : ""}
                  `}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(virtualRow.index)}
                >
                  Row {virtualRow.index}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
