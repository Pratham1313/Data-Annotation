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
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </>
  );
}

export default Imageupload;
