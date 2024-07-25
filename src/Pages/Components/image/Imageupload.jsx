function Imageupload({ setImageSrc }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setImageSrc({
          src: img.src,
          width: img.width,
          height: img.height,
        });
        console.log(img.height, img.width);
      };
    };
    reader.readAsDataURL(file); // imp for displaying img
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 file:px-3 file:py-2 file:rounded-full file:bg-blue-600 file:border-none file:text-white file:cursor-pointer bg-slate-500 px-3 py-2 rounded-full text-white/80  "
        placeholder="dad"
      />
    </>
  );
}

export default Imageupload;
