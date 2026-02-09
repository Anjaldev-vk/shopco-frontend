import React from "react";

const StarRating = ({ rating, maxStars = 5, size = "text-sm" }) => {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else if (rating >= i - 0.5) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {stars}
    </div>
  );
};

export default StarRating;
