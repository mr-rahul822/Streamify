import { Link } from "react-router";
import { getImageUrl } from "../lib/utils";

const CommunityCard = ({ community }) => {

  return (
    <Link to={`/communities/${community._id}`}>
      <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition">
        <img
          src={getImageUrl(community.coverImage) || "https://via.placeholder.com/300"}
          alt={community.name}
          className="w-full h-32 object-cover rounded-xl"
        />
        <h2 className="mt-2 text-lg font-semibold">{community.name}</h2>
        <p className="text-sm text-gray-600">{community.description}</p>
        <p className="text-xs text-gray-400 mt-1">{community.members.length} members</p>
      </div>
    </Link>
  );
};

export default CommunityCard;
