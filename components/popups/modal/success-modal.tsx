import { MdCheckCircle } from "react-icons/md";

const SuccessModal = () => {
  return (
    <div className="px-6 flex flex-col items-center">
      <MdCheckCircle className="text-[#298113] h-28 w-28" />
      <p className="mt-9 font-medium text-primaryBlack mb-10 items-center">
        Transaction Successful
      </p>
    </div>
  );
};

export default SuccessModal;
