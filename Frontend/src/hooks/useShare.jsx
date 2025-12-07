export function useShare() {
  const shareContent = async ({ title, text, url }) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        return { success: true, message: "Shared successfully!" };
      } else {
        // fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        return { success: true, message: "Link copied to clipboard!" };
      }
    } catch (error) {
      return { success: false, message: "Share canceled or failed." };
    }
  };

  return { shareContent };
}
