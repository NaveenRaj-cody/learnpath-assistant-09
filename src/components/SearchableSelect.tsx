import React, { useState, useEffect, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from "@/components/ui/input";

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  noResultsText?: string;
  searchPlaceholder?: string;
  renderAsInput?: boolean;
  popoverWidth?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  className,
  noResultsText = "No results found.",
  searchPlaceholder,
  renderAsInput = false,
  popoverWidth = "w-full"
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    
    const searchLower = searchValue.toLowerCase();
    
    return options.filter(option => {
      const labelLower = option.label.toLowerCase();
      
      if (labelLower.includes(searchLower)) return true;
      
      const searchWords = searchLower.split(/\s+/);
      return searchWords.every(word => labelLower.includes(word));
    });
  }, [options, searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderAsInput ? (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={placeholder}
              value={value ? selectedLabel : ""}
              className={cn(
                "pl-10 pr-10 py-2 w-full glass-input shadow-sm",
                className
              )}
              onClick={() => setOpen(true)}
              readOnly
            />
            <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
          </div>
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between hover:shadow-md active:scale-[0.98] transition-all",
              "border-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
              className
            )}
          >
            <span className="truncate">{value ? selectedLabel : placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className={cn("p-0", popoverWidth)} 
        align="start"
        sideOffset={4}
      >
        <Command className="bg-popover">
          <CommandInput 
            placeholder={searchPlaceholder || `Search ${placeholder.toLowerCase()}...`} 
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="bg-popover">{noResultsText}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={isMobile ? "h-[200px]" : "h-[300px]"}>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-accent/80"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
