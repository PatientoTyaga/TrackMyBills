'use client'

import { useState } from 'react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay,
    addMonths,
    subMonths,
    isSameMonth
} from 'date-fns'
import { CalendarDays } from 'lucide-react'
import CategoryTag from '../category/category-tag'
import { useBills } from '@/context/bill-context'

export default function BillCalendar({ bills: billsProp }) {
    const { bills: billsFromHook } = useBills()
    const bills = billsProp ?? billsFromHook

    const today = new Date()
    const [hoveredDate, setHoveredDate] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(today)

    const currentMonthDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const hasBillsOnDate = (date) => {
        const billsOnDate = bills.filter((bill) =>
            isSameDay(new Date(bill.due_date + 'T12:00:00'), date)
        )
        return billsOnDate.length > 0
    }

    const allBillsPaidOnDate = (date) => {
        const billsOnDate = bills.filter((bill) =>
            isSameDay(new Date(bill.due_date + 'T12:00:00'), date)
        )
        return billsOnDate.length > 0 && billsOnDate.every((bill) => bill.is_paid)
    }

    const billsForDate = (date) =>
        bills.filter((bill) =>
            isSameDay(new Date(bill.due_date + 'T12:00:00'), date)
        )

    const billsForMonth = bills.filter((bill) =>
        isSameMonth(new Date(bill.due_date + 'T12:00:00'), currentMonth)
    )

    const handleToday = () => {
        setCurrentMonth(today)
    }

    const firstDayOfWeek = startOfMonth(currentMonth).getDay();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative min-h-[320px] sm:min-h-[280px]">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    {format(currentMonth, 'MMMM yyyy')} Bills
                </h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600"
                    >
                        ◀ Prev
                    </button>
                    <button
                        onClick={handleToday}
                        className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600"
                    >
                        Next ▶
                    </button>
                </div>
            </div>

            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                📊 {billsForMonth.length} total bill(s) this month —{' '}
                <span className="text-green-600 font-medium">
                    {billsForMonth.filter((b) => b.is_paid).length} paid
                </span>{' '}
                /{' '}
                <span className="text-red-500 font-medium">
                    {billsForMonth.filter((b) => !b.is_paid).length} unpaid
                </span>
            </div>

            <div>
                <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} />
                    ))}

                    {currentMonthDays.map((date) => {
                        const hasBills = hasBillsOnDate(date)
                        const allPaid = allBillsPaidOnDate(date)
                        const isPast = date < startOfMonth(today)

                        return (
                            <div
                                key={date.toISOString()}
                                onMouseEnter={() => setHoveredDate(date)}
                                onMouseLeave={() => setHoveredDate(null)}
                                className="relative"
                            >
                                <div
                                    className={`py-1 px-2 rounded cursor-default flex items-center justify-center gap-1 ${allPaid
                                        ? 'bg-green-100 text-green-800 font-semibold'
                                        : hasBills
                                            ? 'bg-blue-100 text-blue-800 font-semibold'
                                            : isPast
                                                ? 'text-gray-400 dark:text-gray-500'
                                                : 'text-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {format(date, 'd')}
                                    {allPaid && <span>✅</span>}
                                </div>

                                {hoveredDate && isSameDay(hoveredDate, date) && billsForDate(date).length > 0 && (
                                    <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 w-52 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded p-2 text-left text-xs">
                                        <strong className="block mb-1">{format(new Date(date), 'PPP')}</strong>
                                        <ul className="space-y-1">
                                            {billsForDate(date).map((bill) => (
                                                <li key={bill.id} className="flex flex-col">
                                                    <div className="flex justify-between">
                                                        <span>
                                                            📝 <strong>{bill.name}</strong>: {bill.amount} {bill.currency}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <span className={bill.is_paid ? 'text-green-600' : 'text-red-500'}>
                                                            ({bill.is_paid ? 'Paid' : 'Unpaid'})
                                                        </span>
                                                        {bill.category && (
                                                            <span className="ml-2">
                                                                <CategoryTag category={bill.category} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}