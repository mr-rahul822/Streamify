import { Link } from "react-router";
import { getImageUrl } from "../lib/utils";

const CommunityCard = ({ community }) => {

  const normalizedCover = getImageUrl(community.coverImage) || community.coverImage || "";
  const hasCover = typeof normalizedCover === "string" && normalizedCover.trim().length > 0;

  return (
    <Link to={`/communities/${community._id}`}>
      <div className="bg-base-100 shadow-md rounded-2xl p-4 hover:shadow-lg transition">
        {hasCover ? (
          <img
            src={normalizedCover}
            alt={community.name}
            className="w-full h-32 object-cover rounded-xl"
            onError={(e) => {
              // If cover fails, swap to visible dark placeholder
              e.currentTarget.src = "https://placehold.co/600x200/111111/FFFFFF?text=Community";
            }}
          />
        ) : (
          <div className="w-full h-32 rounded-xl bg-base-300 flex items-center justify-center">
            <span className="text-base-content/80 text-sm">No cover image</span>
          </div>
        )}
        <h2 className="mt-2 text-lg font-semibold text-base-content">{community.name}</h2>
        {community.description && (
          <p className="text-sm opacity-80 text-base-content">{community.description}</p>
        )}
        <p className="text-xs opacity-60 text-base-content mt-1">{community.members.length} members</p>
      </div>
    </Link>
  );
};

export default CommunityCard;
