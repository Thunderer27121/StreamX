export default function Video({ src, onTimeUpdate }, ref) {
  return (
    <video
      src={src}
      ref={ref}
      controls
      autoPlay
      onTimeUpdate={onTimeUpdate}
      className="w-full  h-36 lg:h-70 rounded-xl mt-10 "
    />
  );
}
