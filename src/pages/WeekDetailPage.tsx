import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { WeekDetailView } from "../components/timesheet/WeekDetailView";
import { useTimesheetDetail } from "../hooks/useTimesheets";

export function WeekDetailPage() {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const {
    timesheet,
    isLoading,
    error,
    fetchTimesheet,
    addEntry,
    editEntry,
    removeEntry,
  } = useTimesheetDetail(weekId!);

  useEffect(() => {
    if (weekId) fetchTimesheet();
  }, [weekId, fetchTimesheet]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-[88%] px-4 py-8 sm:px-6">

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-32">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => fetchTimesheet()}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : timesheet ? (
          <>
            <WeekDetailView
              timesheet={timesheet}
              onAddEntry={addEntry}
              onEditEntry={editEntry}
              onDeleteEntry={removeEntry}
            />
            <div className="px-6 py-8 text-center bg-white shadow-sm mt-4 rounded-xl">
              <p className="text-xs text-[#6B7280] font-normal">
                © 2024 tentwenty. All rights reserved.
              </p>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
