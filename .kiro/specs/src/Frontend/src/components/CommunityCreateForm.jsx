import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunity } from "../lib/api";
import toast from "react-hot-toast";

const CommunityCreateForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    coverImage: null, // file store karenge
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      toast.success("Community created 🎉");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      if (onClose) onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create community");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ File ke sath FormData banana
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold mb-4">Create Community</h2>

      <input
        type="text"
        placeholder="Community Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="input input-bordered w-full mb-3"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="textarea textarea-bordered w-full mb-3"
      />

      {/* ✅ File Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setForm({ ...form, coverImage: e.target.files[0] })
        }
        className="file-input file-input-bordered w-full mb-3"
      />

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full"
      >
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CommunityCreateForm;
