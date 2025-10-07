"use client";

import { useCaseContext, Case } from "@/app/context/CaseContext";
import Image from "next/image";
import { useState } from "react";
import MediaUpload from "@/components/MediaUpload";

export default function CasesList() {
  const { cases, updateCase, deleteCase } = useCaseContext();
  const [addingMediaId, setAddingMediaId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<{
    caseId: number;
    field: keyof Omit<Case, "id" | "created_at" | "case_slug" | "images">;
  } | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  if (!cases.length) return <p>No cases found</p>;

  const handleStartEdit = (
    c: Case,
    field: keyof Omit<Case, "id" | "created_at" | "case_slug" | "images">
  ) => {
    setEditingField({ caseId: c.id, field });
    setFieldValue(c[field] ?? "");
  };

  const handleSaveEdit = async () => {
    if (editingField) {
      const { caseId, field } = editingField;
      await updateCase(caseId, { [field]: fieldValue });
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleDelete = async (c: Case) => {
    if (
      confirm(`Are you sure you want to delete "${c.title ?? "this case"}"?`)
    ) {
      await deleteCase(c.id);
    }
  };

  const handleRemoveMedia = async (c: Case, index: number) => {
    const updatedMedia = c.images?.filter((_, i) => i !== index) ?? [];
    await updateCase(c.id, {
      images: updatedMedia.length ? updatedMedia : null,
    });
  };

  const handleAddMedia = async (c: Case, urls: string[]) => {
    const updatedMedia = [...(c.images ?? []), ...urls];
    await updateCase(c.id, { images: updatedMedia });
    setAddingMediaId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {cases.map((c) => (
        <div key={c.id} className="border p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            {editingField?.caseId === c.id && editingField.field === "title" ? (
              <div className="flex gap-2">
                <input
                  className="border p-1 rounded"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                />
                <button
                  className="text-green-600 hover:underline"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3
                  className="font-bold cursor-pointer"
                  onClick={() => handleStartEdit(c, "title")}
                >
                  {c.title ?? "Untitled"}
                </h3>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(c)}
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Render other editable fields */}
          {(["client", "description", "category", "year"] as const).map(
            (field) => (
              <p key={field}>
                <strong>{field[0].toUpperCase() + field.slice(1)}: </strong>
                {editingField?.caseId === c.id &&
                editingField.field === field ? (
                  <span className="flex gap-2">
                    <input
                      className="border p-1 rounded"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button
                      className="text-green-600 hover:underline"
                      onClick={handleSaveEdit}
                    >
                      Save
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
                    onClick={() => handleStartEdit(c, field)}
                  >
                    {c[field] ?? "-"}
                  </span>
                )}
              </p>
            )
          )}

          {/* Media display */}
          {(c.images ?? []).length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {(c.images ?? []).map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded overflow-hidden"
                >
                  {img.match(/\.(mp4|mov|webm)$/i) ? (
                    <video
                      src={img}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <Image
                      src={img}
                      alt={`Case media ${i + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    onClick={() => handleRemoveMedia(c, i)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add media */}
          <div className="mt-2">
            {addingMediaId === c.id ? (
              <MediaUpload onUpload={(urls) => handleAddMedia(c, urls)} />
            ) : (
              <button
                className="text-sm text-green-600 hover:underline"
                onClick={() => setAddingMediaId(c.id)}
              >
                + Add Images/Videos
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
