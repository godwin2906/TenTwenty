import { useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import { TimesheetTable } from "../components/timesheet/TimesheetTable";
import { FiltersBar } from "../components/timesheet/FiltersBar";
import { useTimesheets } from "../hooks/useTimesheets";
import type { TimesheetFilters } from "../types";

export function DashboardPage() {
  const { timesheets, isLoading, error, fetchTimesheets } = useTimesheets();

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const handleFilterChange = (filters: TimesheetFilters) => {
    fetchTimesheets(filters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-[88%] px-4 py-8 sm:px-6">
        <div className="rounded-xl  bg-white shadow-sm">
          <div className=" px-6 py-5">
            <h1 className="mb-4 text-xl font-bold text-gray-900">
              Your Timesheets
            </h1>
            <FiltersBar onFilterChange={handleFilterChange} />
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={() => fetchTimesheets()}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <TimesheetTable timesheets={timesheets} />
            )}
          </div>
        </div>
        <div className="px-6 py-10 text-center bg-white shadow-sm mt-4 rounded-xl">
          <p className="text-xs text-[#6B7280] font-normal">
            © 2024 tentwenty. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
