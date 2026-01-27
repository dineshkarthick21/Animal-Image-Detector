import { useState } from "react";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://animal-detector-cqg5.onrender.com/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data.prediction);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div>
          <img src={preview} alt="preview" width="200" />
        </div>
      )}

      <button onClick={handlePredict}>Predict</button>

      {result && <h2>Result: {result}</h2>}
    </div>
  );
}

export default ImageUpload;
