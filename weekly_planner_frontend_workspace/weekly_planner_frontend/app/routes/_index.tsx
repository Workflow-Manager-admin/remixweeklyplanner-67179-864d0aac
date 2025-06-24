import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

/** PUBLIC_INTERFACE
 * Meta information for the Weekly Planner app
 */
export const meta: MetaFunction = () => {
  return [
    { title: "Weekly Planner" },
    { name: "description", content: "A simple weekly planner SPA using Remix and Tailwind CSS." },
  ];
};

type Task = {
  id: string;
  title: string;
  description: string;
  time?: string;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_CARD_COLORS = [
  "bg-[#f3f4f6]", // Monday
  "bg-[#f4f8fb]", // Tuesday
  "bg-[#f7fafc]", // Wednesday
  "bg-[#e8f7f2]", // Thursday
  "bg-[#f9f5ff]", // Friday
  "bg-[#eefff6]", // Saturday
  "bg-[#fdf3f7]", // Sunday
];

function getColor(index: number) {
  return DAY_CARD_COLORS[index % DAY_CARD_COLORS.length];
}

const ACCENT = "#10b981";
const PRIMARY = "#4f46e5";

/** PUBLIC_INTERFACE
 * Modal component for adding new tasks.
 * @param props open:boolean, onClose:()=>void, onSave:(task) => void, forDay: string
 */
function AddTaskModal({
  open,
  onClose,
  onSave,
  forDay,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  forDay: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      time: time.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setTime("");
  }

  function handleClose() {
    setTitle("");
    setDescription("");
    setTime("");
    onClose();
  }

  // Remove autoFocus, use ref to focus input field
  const titleInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  // For a11y, allow keyboard ESC to close modal and add tabIndex/role/keyboard handler to backdrop
  function handleBackdropKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") handleClose();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 transition-opacity">
      <div
        className="fixed inset-0"
        onClick={handleClose}
        onKeyDown={handleBackdropKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close modal backdrop"
      />
      <div className="relative z-30 max-w-sm w-[92vw] rounded-xl shadow-2xl bg-white p-6 border border-gray-200">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Add Task for {forDay}</h3>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Title <span className="text-red-500">*</span>
            <input
              ref={titleInputRef}
              className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ "--accent": ACCENT } as React.CSSProperties}
              type="text"
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Description
            <textarea
              className="border rounded-lg px-3 py-2 text-base min-h-[60px] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{ "--primary": PRIMARY } as React.CSSProperties}
              value={description}
              maxLength={200}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Time
            <input
              className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{ "--primary": PRIMARY } as React.CSSProperties}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Optional time"
            />
          </label>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border-0 text-white font-semibold"
              style={{ background: ACCENT, boxShadow: "0 1.5px 4px #10b98113" }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * TaskCard component for showing an individual task and a delete option.
 */
function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: () => void;
}) {
  return (
    <div className="group relative border border-gray-200 rounded-lg bg-white p-3 hover:shadow transition mb-2 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{task.title}</span>
        <button
          className="opacity-60 hover:opacity-90 ml-2 text-xs px-2 py-0.5 rounded-md border border-transparent hover:border-red-200 hover:bg-red-50 text-red-500 transition"
          title="Delete Task"
          onClick={onDelete}
        >
          ×
        </button>
      </div>
      {task.description && (
        <div className="text-xs text-gray-500 pl-0.5 pt-1">{task.description}</div>
      )}
      {task.time && (
        <div className="absolute top-2 right-10 text-xs font-mono text-[var(--accent)] bg-opacity-30 px-1"
          style={{ "--accent": ACCENT } as React.CSSProperties}>
          {task.time}
        </div>
      )}
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Card component for each day that shows the day's name, tasks, and an add button.
 */
function DayCard({
  day,
  tasks,
  onAddTask,
  onDeleteTask,
}: {
  day: string;
  tasks: Task[];
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 px-2 pb-2 pt-3 shadow-sm min-h-[270px] ${getColor(
        DAYS.indexOf(day),
      )}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-700 tracking-tight">{day}</h2>
        <button
          className="rounded-full p-1.5 text-white"
          title="Add New Task"
          style={{
            background: ACCENT,
            boxShadow: "0 2px 8px #10b98115",
          }}
          onClick={onAddTask}
        >
          <svg
            width={18}
            height={18}
            fill="none"
            viewBox="0 0 18 18"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="9"
              r="8"
              fill={ACCENT}
              fillOpacity={0.15}
              stroke={ACCENT}
              strokeWidth={1}
            />
            <path
              d="M9 5v8m4-4H5"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <div className="text-gray-400 text-xs py-4 text-center italic select-none">
            No tasks yet.
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} />
        ))}
      </div>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Top-level Weekly Planner page, uses in-memory state for all week tasks.
 */
export default function Index() {
  // State: mapping of day -> list of tasks
  const [tasksByDay, setTasksByDay] = useState<Record<string, Task[]>>(() =>
    Object.fromEntries(DAYS.map((d) => [d, []])),
  );

  // Modal: which day is open (if any)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<string | null>(null);

  // Open modal to add task
  function openAddModal(day: string) {
    setModalDay(day);
    setModalOpen(true);
  }
  // Save a new task to given day
  function handleSaveTask(task: Omit<Task, "id">) {
    if (!modalDay) return;
    setTasksByDay((prev) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return {
        ...prev,
        [modalDay]: [
          ...prev[modalDay],
          { ...task, id },
        ],
      };
    });
    setModalOpen(false);
    setModalDay(null);
  }
  // Delete a task from given day
  function handleDeleteTask(day: string, id: string) {
    setTasksByDay((prev) => ({
      ...prev,
      [day]: prev[day].filter((t) => t.id !== id),
    }));
  }

  return (
    <main className="min-h-screen flex flex-col bg-white font-sans" style={{ background: "#fff" }}>
      <header className="w-full flex flex-col items-center pt-8 pb-3">
        <h1 className="font-extrabold text-3xl sm:text-4xl text-center tracking-tight text-gray-800">
          Weekly Planner
        </h1>
        <p className="mt-2 text-gray-500 font-medium text-base max-w-lg text-center">
          Plan your week with tasks for each day. Everything is in-memory—refreshing will reset your tasks.
        </p>
      </header>
      <section className="flex-1 flex flex-col items-center w-full px-1">
        <div className="w-full max-w-[1220px] mx-auto pb-20">
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-7
              gap-5 md:gap-6
              px-1 md:px-0
              transition-all
            "
          >
            {DAYS.map((day) => (
              <DayCard
                key={day}
                day={day}
                tasks={tasksByDay[day]}
                onAddTask={() => openAddModal(day)}
                onDeleteTask={(taskId) => handleDeleteTask(day, taskId)}
              />
            ))}
          </div>
        </div>
      </section>
      <AddTaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalDay(null);
        }}
        onSave={handleSaveTask}
        forDay={modalDay ?? ""}
      />
      <footer className="w-full py-5 text-center text-xs text-gray-400 border-t mt-auto">
        Weekly Planner &copy; {new Date().getFullYear()} &mdash; <span className="text-[var(--primary)]" style={{ "--primary": PRIMARY } as React.CSSProperties}>Remix + Tailwind</span>
      </footer>
      {/* Accent highlights for focus outlines */}
      <style>
        {`
          :root {
            --accent: #10b981;
            --primary: #4f46e5;
          }
          .focus:ring-[var(--accent)]:focus {
            box-shadow: 0 0 0 2px var(--accent);
          }
          .focus:ring-[var(--primary)]:focus {
            box-shadow: 0 0 0 2px var(--primary);
          }
        `}
      </style>
    </main>
  );
}
