import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  open: boolean;
  onPopoverChange: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  trigger,
  content,
  className,
  open,
  onPopoverChange,
}) => {
  return (
    <Popover open={open} onOpenChange={onPopoverChange}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={`w-64 ${className}`}>{content}</PopoverContent>
    </Popover>
  );
};
