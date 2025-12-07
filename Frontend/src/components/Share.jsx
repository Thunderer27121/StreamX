// src/components/Share.jsx
import { Share2 } from "lucide-react";

export default function Share({
  url,
  title,
  text = "Check this out!",
  className = "",
}) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("Shared via native share");
      } else {
        await navigator.clipboard.writeText(url);
        console.log("Link copied to clipboard");
      }
    } catch (err) {
      console.log("Share cancelled or failed");
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold transition ${className}`}
    >
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </button>
  );
}
