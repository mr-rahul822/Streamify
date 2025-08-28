import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "../lib/api";
import CommunityCard from "../components/CommunityCard";
import CommunityCreateForm from "../components/CommunityCreateForm";
import { useState } from "react";

const CommunitiesPage = () => {
  const { data: communities, isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: getCommunities,
  });

  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h2>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary rounded-xl"
        >
          + Create Community
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-base-100 p-6 rounded-2xl shadow-xl relative text-base-content">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 opacity-70 hover:opacity-100"
            >
              ✖
            </button>
            <CommunityCreateForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities?.map((c) => (
          <CommunityCard key={c._id} community={c} />
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;
