import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Minus, Plus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { getProjectsApi, getWorkTypesApi } from "../../api/timesheets";
import type { EntryFormData, TimesheetEntry } from "../../types";

const schema = z.object({
  project: z.string().min(1, "Project is required"),
  typeOfWork: z.string().min(1, "Type of work is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  hours: z.number().min(0.5, "Minimum 0.5 hours").max(24, "Maximum 24 hours"),
});

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryFormData) => Promise<void>;
  editEntry?: TimesheetEntry | null;
  isSubmitting: boolean;
}

export function EntryModal({
  isOpen,
  onClose,
  onSubmit,
  editEntry,
  isSubmitting,
}: EntryModalProps) {
  const projects = getProjectsApi().map((p) => ({ value: p, label: p }));
  const workTypes = getWorkTypesApi().map((t) => ({ value: t, label: t }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: "",
      typeOfWork: "Bug fixes",
      description: "",
      hours: 1,
    },
  });

  const hours = watch("hours");

  useEffect(() => {
    if (editEntry) {
      reset({
        project: editEntry.project,
        typeOfWork: editEntry.typeOfWork,
        description: editEntry.description,
        hours: editEntry.hours,
      });
    } else {
      reset({
        project: "",
        typeOfWork: "Bug fixes",
        description: "",
        hours: 1,
      });
    }
  }, [editEntry, isOpen, reset]);

  const changeHours = (delta: number) => {
    const next = Math.max(0.5, Math.min(24, hours + delta));
    setValue("hours", next, { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editEntry ? "Edit Entry" : "Add New Entry"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="px-5 py-4 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm font-medium text-[#111928]">
              Select Project <span className="text-[#111928]">*</span>
              <Info size={12} className="text-gray-400" />
            </label>
            <select
              {...register("project")}
              className={`w-1/2 rounded-md border px-3 py-2 text-sm focus:outline-none text-[#6B7280] ${
                errors.project ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Project Name</option>
              {projects.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.project && (
              <p className="text-xs text-[#111928]">{errors.project.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm font-medium text-[#111928]">
              Type of Work <span className="text-[#111928]">*</span>
              <Info size={12} className="text-gray-400" />
            </label>
            <select
              {...register("typeOfWork")}
              className={`w-1/2 rounded-md border px-3 py-2 text-sm focus:outline-none  text-[#6B7280] ${
                errors.typeOfWork ? "border-red-400" : "border-gray-300"
              }`}
            >
              {workTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.typeOfWork && (
              <p className="text-xs text-red-500">
                {errors.typeOfWork.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm font-medium text-[#111928]">
              Task description <span className="text-[#111928]">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Write text here ..."
              className={`w-3/4 rounded-md border px-3 py-2 text-sm resize-none focus:outline-none ${
                errors.description ? "border-red-400" : "border-gray-300"
              }`}
            />
            <p className="text-xs text-gray-400">A note for extra info</p>
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="flex items-center gap-1 text-sm font-medium text-[#111928]">
              Hours <span className="text-[#111928]">*</span>
            </label>
            <div className="flex items-center border border-[#D1D5DB] w-fit rounded-md">
              <button
                type="button"
                onClick={() => changeHours(-0.5)}
                className="flex h-7 w-7 items-center justify-center rounded-l-md  bg-[#F3F4F6]  text-[#111928] transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {hours}
              </span>
              <button
                type="button"
                onClick={() => changeHours(0.5)}
                className="flex h-7 w-7 items-center justify-center rounded-r-md bg-[#F3F4F6]  text-[#111928] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            {errors.hours && (
              <p className="text-xs text-red-500">{errors.hours.message}</p>
            )}
          </div>
        </div>
        <div className="px-5 py-6 border-[#D1D5DB] border-t">
          <div className="flex items-center gap-3 pt-1 w-full">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-[50%] focus:outline-none"
            >
              {editEntry ? "Update entry" : "Add entry"}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-[#E5E7EB] text-[#111928]  transition-colors px-4 py-2 text-sm w-[50%]"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
