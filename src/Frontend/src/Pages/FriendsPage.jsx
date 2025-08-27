import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { UsersIcon, ClockIcon, CheckCircleIcon, MessageSquareIcon } from "lucide-react";
import toast from "react-hot-toast";

import { 
  getUserFriends, 
  getOutgoingFriendReqs, 
  sendFriendRequest 
} from "../lib/api";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // ✅ Friends Query
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // ✅ Outgoing Friend Requests Query
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // ✅ Send Friend Request Mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending friend request:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send friend request";
      toast.error(errorMessage);
    },
  });

  // ✅ Track outgoing requests
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient && req.recipient._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends & Requests
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends Section */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => {
              // Skip rendering if friend is null or missing _id
              if (!friend || !friend._id) {
                return null;
              }
              return <FriendCard key={friend._id} friend={friend} />;
            })}
          </div>
        )}

        {/* Outgoing Requests Section */}
        <section className="mt-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">
            Pending Friend Requests
          </h3>
          {outgoingFriendReqs.length === 0 ? (
            <p className="opacity-70">No pending requests</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {outgoingFriendReqs.map((req) => {
                // Skip rendering if recipient is null or missing required fields
                if (!req.recipient || !req.recipient._id) {
                  return null;
                }
                
                return (
                  <div
                    key={req._id}
                    className="card bg-base-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-14 rounded-full">
                          <img
                            src={req.recipient.profilePic || "https://via.placeholder.com/56"}
                            alt={req.recipient.fullName || "User"}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{req.recipient.fullName || "Unknown User"}</h4>
                          <p className="text-xs opacity-70">{req.recipient.email || "No email"}</p>
                        </div>
                      </div>

                    {/* Status */}
                    <div className="mt-2">
                      {req.status === "pending" ? (
                        <span className="badge badge-warning gap-1">
                          <ClockIcon className="size-3" /> Pending
                        </span>
                      ) : req.status === "accepted" ? (
                        <span className="badge badge-success gap-1">
                          <CheckCircleIcon className="size-3" /> Accepted
                        </span>
                      ) : (
                        <span className="badge badge-neutral">Unknown</span>
                      )}
                    </div>

                    {/* Message button only if accepted */}
                    {req.status === "accepted" && (
                      <button
                        className="btn btn-primary w-full mt-3"
                        onClick={() => navigate(`/chat/${String(req.recipient._id)}`)}
                      >
                        <MessageSquareIcon className="size-4 mr-2" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FriendsPage;
