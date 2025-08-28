import { Link } from "react-router";
import { getImageUrl } from "../lib/utils";

const CommunityCard = ({ community }) => {

  const coverSrc = getImageUrl(community.coverImage) || community.coverImage || "https://via.placeholder.com/600x200";

  return (
    <Link to={`/communities/${community._id}`}>
      <div className="bg-base-100 shadow-md rounded-2xl p-4 hover:shadow-lg transition">
        <img
          src={coverSrc}
          alt={community.name}
          className="w-full h-32 object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/600x200";
          }}
        />
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
