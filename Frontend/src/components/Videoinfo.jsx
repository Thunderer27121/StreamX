export default function VideoInfo({ video }) {
  return (
    <>
      <h1 className="text-3xl text-white mt-4">{video?.title}</h1>
      <p className="text-gray-400 mt-2">
        {video?.views?.length} views • {new Date(video?.createdAt).toLocaleDateString()}
      </p>
    </>
  );
}
