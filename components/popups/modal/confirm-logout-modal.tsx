import { Button } from "@/components/ui/button";
import useModalStore from "@/hooks/store/useModalStore";
import { handleLogout } from "@/lib/actions/logout";

const ConfirmLogoutModal = () => {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleSubmitComment = async () => {
    closeModal();
    handleLogout();
  };

  return (
    <div className="px-6">
      <h6 className="text-primaryBlack font-medium text-center">Logout</h6>
      <p className="text-primaryBlack text-center mt-4 mb-10">
        Are you sure you want to logout?
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => closeModal()}
          variant="ghost"
          className="bg-primaryGreen/10 text-primaryGreen px-12 rounded-xl"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmitComment} className="px-9 rounded-xl">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
