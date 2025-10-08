"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Case } from "@/app/context/CaseContext";
import MediaUpload from "@/components/MediaUpload";
import { createClient } from "@/lib/supabase/client";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import Image from "next/image";

const supabase = createClient();

interface SortableMediaItemProps {
  img: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableMediaItem({ img, index, onRemove }: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-24 h-24 rounded overflow-hidden cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      {img.match(/\.(mp4|mov|webm)$/i) ? (
        <video
          src={img}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
        />
      ) : (
        <Image
          src={img}
          alt={`Media ${index + 1}`}
          fill
          className="w-full h-full object-cover"
        />
      )}
      <button
        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function EditCaseClient() {
  const { slug } = useParams();
  const router = useRouter();
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingField, setEditingField] = useState<
    keyof Omit<Case, "id" | "created_at" | "case_slug" | "images"> | null
  >(null);
  const [fieldValue, setFieldValue] = useState("");
  const [addingMedia, setAddingMedia] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // 🧩 Fetch case data once
  useEffect(() => {
    if (!slug) return;
    const fetchCase = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("case_slug", slug)
        .single();

      if (error) {
        console.error(error);
        setCurrentCase(null);
      } else {
        setCurrentCase(data);
        setLocalImages(data.images ?? []);
      }
      setLoading(false);
    };
    fetchCase();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!currentCase) return <p>Case not found</p>;

  // 🧠 Field editing
  const handleStartEdit = (
    field: keyof Omit<Case, "id" | "created_at" | "case_slug" | "images">
  ) => {
    if (!currentCase) return;

    setEditingField(field);

    // Ensure fieldValue is always a string
    const value = currentCase[field];
    setFieldValue(value === null || value === undefined ? "" : String(value));
  };

  const handleSaveEdit = () => {
    if (!editingField || !currentCase) return;
    const updated = { ...currentCase, [editingField]: fieldValue };
    setCurrentCase(updated);
    setEditingField(null);
  };

  const handleCancelEdit = () => setEditingField(null);

  // 🗑️ Delete case
  const handleDelete = async () => {
    if (!currentCase) return;
    if (confirm(`Delete "${currentCase.title ?? "this case"}"?`)) {
      await supabase.from("cases").delete().eq("id", currentCase.id);
      router.push("/protected");
    }
  };

  // 🖼️ Media handling
  const handleAddMedia = (urls: string[]) => {
    setLocalImages((prev) => [...prev, ...urls]);
    setAddingMedia(false);
  };

  const handleRemoveMedia = (index: number) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setLocalImages((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  // 💾 Save changes
  const handleSaveAndBack = async () => {
    if (!currentCase) return;
    setSaving(true);

    const updated = { ...currentCase, images: localImages };
    const { error } = await supabase
      .from("cases")
      .update(updated)
      .eq("id", currentCase.id);

    setSaving(false);
    if (error) {
      console.error(error);
      toast.error("❌ Failed to save changes");
    } else {
      toast.success("✅ Case updated successfully");
      router.push("/protected");
      router.refresh();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {currentCase.title ?? "Untitled"}
      </h1>

      <button
        className="text-red-600 mb-4 hover:underline"
        onClick={handleDelete}
      >
        Delete Case
      </button>

      {/* Editable fields */}
      {(["title", "client", "description", "category", "year"] as const).map(
        (field) => (
          <div key={field} className="mb-3">
            <strong>{field[0].toUpperCase() + field.slice(1)}: </strong>
            {editingField === field ? (
              <span className="flex gap-2 mt-1">
                <input
                  className="border p-1 rounded flex-1"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                />
                <button
                  className="text-green-600 hover:underline"
                  onClick={handleSaveEdit}
                >
                  Done
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleStartEdit(field)}
              >
                {currentCase[field] ?? "-"}
              </span>
            )}
          </div>
        )
      )}

      {/* Media DnD grid */}
      <div className="mt-4">
        <strong>Media:</strong>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            handleReorder(
              parseInt(active.id.toString()),
              parseInt(over.id.toString())
            );
          }}
        >
          <SortableContext
            items={localImages.map((_, i) => i.toString())}
            strategy={rectSortingStrategy}
          >
            <div className="flex gap-2 flex-wrap mt-2">
              {localImages.map((img, i) => (
                <SortableMediaItem
                  key={i}
                  img={img}
                  index={i}
                  onRemove={handleRemoveMedia}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {addingMedia ? (
          <MediaUpload onUpload={handleAddMedia} />
        ) : (
          <button
            className="mt-2 text-green-600 hover:underline"
            onClick={() => setAddingMedia(true)}
          >
            + Add Media
          </button>
        )}
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSaveAndBack}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save & Go Back"}
      </button>
    </div>
  );
}
