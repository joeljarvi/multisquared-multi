"use client";

import { useState } from "react";
import { useCaseContext } from "@/app/context/CaseContext";
import MediaUpload from "@/components/MediaUpload";

export default function CaseForm() {
  const { addCase } = useCaseContext();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (urls: string[]) => {
    // Append new uploads
    setMedia((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addCase({
        case_slug: slug,
        title,
        client,
        description,
        category: category || null,
        year: year || null,
        images: media.length > 0 ? media : null,
      });

      // Reset form
      setSlug("");
      setTitle("");
      setClient("");
      setDescription("");
      setCategory("");
      setYear("");
      setMedia([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add case");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border p-4 rounded"
    >
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Case slug, t.ex bron_abro"
        value={slug} // ✅ correct
        onChange={(e) => setSlug(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
        rows={4}
        required
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border p-2 rounded"
      />

      {/* 🖼️ Media uploader replaces the old text field */}
      <div>
        <label className="font-semibold block mb-1">Images / Videos</label>
        <MediaUpload onUpload={handleUpload} />

        {media.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {media.length} file{media.length > 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Case"}
      </button>
    </form>
  );
}
