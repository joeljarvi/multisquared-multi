"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCaseContext, Case } from "@/app/context/CaseContext";

function SortableCaseCard({ c, onEdit }: { c: Case; onEdit: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition"
    >
      <h3 className="font-bold text-lg mb-1">{c.title ?? "Untitled"}</h3>
      <p className="text-sm text-gray-500 mb-3">{c.client}</p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent drag interference
          onEdit();
        }}
        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Edit
      </button>
    </div>
  );
}

export default function CasesListClient() {
  const { cases, setCases, updateCaseOrder } = useCaseContext();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  // ensure client-only rendering
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!cases.length) return <p className="p-4">No cases found</p>;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cases.findIndex((c) => c.id === active.id);
    const newIndex = cases.findIndex((c) => c.id === over.id);

    const reordered = arrayMove(cases, oldIndex, newIndex);
    setCases(reordered);

    setSaving(true);
    try {
      await updateCaseOrder(reordered); // updates Supabase order
      toast.success("Case order saved!");
    } catch (err) {
      console.error("Failed to save order:", err);
      toast.error("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      {saving && <p className="text-sm text-gray-400 mb-2">Saving order...</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cases.map((c) => c.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => (
              <SortableCaseCard
                key={c.id}
                c={c}
                onEdit={() => router.push(`/protected/edit/${c.case_slug}`)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
