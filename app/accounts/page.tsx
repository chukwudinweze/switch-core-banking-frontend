"use client";

import Accounts from "./accounts";
import { Filter } from "@/components/table/filter";
import { Button } from "@/components/ui/button";
import useModalStore from "@/hooks/store/useModalStore";

const filterbyAcctType = [
  { label: "All", value: "all" },
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
  { label: "Loan", value: "loan" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
  { label: "NGN", value: "ngn" },
  { label: "USD", value: "usd" },
  { label: "Positive Balance", value: "positive" },
  { label: "Negative Balance", value: "negative" },
];

const sortOptions = [
  { label: "All", value: "all" },
  { label: "Balance", value: "balance" },
  { label: "Last Transaction", value: "lasttransactiondate" },
  { label: "Account Name", value: "accountname" },
  { label: "Account Type", value: "accounttype" },
  { label: "Status", value: "status" },
];

const Page = () => {
  const openModal = useModalStore((state) => state.openModal);
  return (
    <section>
      <div className="flex items-center justify-between mb-14">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <Button
          onClick={() => openModal("transferRequest")}
          className="px-10 font-semibold"
        >
          Transfer
        </Button>
      </div>
      <Filter
        filterBy={filterbyAcctType}
        sortOptions={sortOptions}
        noGlobalSearch
        noDateFilter
      />
      <Accounts />
    </section>
  );
};

export default Page;
