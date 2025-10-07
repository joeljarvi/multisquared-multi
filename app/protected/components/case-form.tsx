"use client";

import { useState } from "react";
import Image from "next/image";
import { useCaseContext } from "@/app/context/CaseContext";
import ImageUpload from "@/components/ImageUpload";

export default function CaseForm() {
  const { addCase } = useCaseContext();

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addCase({
        title,
        client,
        description,
        category: category || null,
        year: year || null,
        images: images.length > 0 ? images : null,
      });

      // Clear form
      setTitle("");
      setClient("");
      setDescription("");
      setCategory("");
      setYear("");
      setImages([]);
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

      {/* Image upload */}
      <ImageUpload onUpload={(urls) => setImages(urls)} />

      {/* Image previews using next/image */}
      {images.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((url) => (
            <div key={url} className="relative w-24 h-24">
              <Image
                src={url}
                alt="Uploaded"
                fill
                style={{ objectFit: "cover", borderRadius: "0.25rem" }}
              />
            </div>
          ))}
        </div>
      )}

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
