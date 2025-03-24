// app/components/BillList.jsx
export default function BillList({ bills }) {
    if (bills.length === 0) {
      return <p className="text-muted-foreground">No upcoming bills. Add one to get started.</p>
    }
  
    return (
      <ul className="space-y-2">
        {bills.map((bill, index) => (
          <li key={index} className="p-3 border rounded shadow-sm bg-card">
            <div className="font-medium">{bill.name}</div>
            <div className="text-sm text-muted-foreground">
              Amount: ${bill.amount} | Due: {bill.dueDate}
            </div>
          </li>
        ))}
      </ul>
    )
  }
  