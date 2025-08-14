import { DataTable } from "@/components/table/data-table";
import Configs from "@/lib/configs";
import { TransactionHistoryColumn } from "./columns";

interface IParams {
  accountId: string;
}

// Type for server component props
interface PageProps {
  params: Promise<IParams>;
}

const Page = async ({ params }: PageProps) => {
  const { accountId } = await params;

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Credit", value: "Credit" },
    { label: "Debit", value: "Debit" },
  ];

  const categoryOptions = [
    { label: "All", value: "all" },
    { label: "Salary", value: "Salary" },
    { label: "Withdrawal", value: "Withdrawal" },
    { label: "Transfer", value: "Transfer" },
  ];

  const sortOptions = [
    { label: "All", value: "all" },
    { label: "Date", value: "date" },
    { label: "Amount", value: "amount" },
    { label: "Type", value: "type" },
    { label: "Category", value: "category" },
    { label: "Reference", value: "reference" },
    { label: "Beneficiary Account", value: "beneficiaryAccount" },
    { label: "Transaction ID", value: "id" },
    { label: "Description", value: "description" },
  ];

  return (
    <div>
      <DataTable
        columns={TransactionHistoryColumn}
        emptyTableText="No transactions found"
        filterPlaceholder="Search transactions"
        // Type filter
        filterOptions={typeOptions}
        // Category filter
        userFilterOptions={categoryOptions}
        userFilterLabel="category"
        // Sorting
        sortOptions={sortOptions}
        // Date and endpoint
        dateFilterPlaceholder="Date range"
        endpoint={`api/accounts/${accountId}/transactions`}
        isExportable
        exportUrl={`/api/accounts/${accountId}/transactions/download-transactions`}
      />
    </div>
  );
};

export default Page;
