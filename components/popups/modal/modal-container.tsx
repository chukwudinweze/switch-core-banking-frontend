import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/store/useModalStore";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CustomModalProps {
  children: ReactNode;
  isModalOpen: boolean;
  isCloseButton?: boolean;
  className?: string;
}

const ModalContainer = ({
  children,
  isModalOpen,
  className,
  isCloseButton,
}: CustomModalProps) => {
  const { closeModal } = useModalStore();
  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent
        className={cn("sm:max-w-[500px]", className)}
        close={isCloseButton}
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <DialogDescription className="sr-only"></DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalContainer;
