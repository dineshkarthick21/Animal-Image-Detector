import { useState } from "react";
import "../styles/premium-ui.css";

const animalInfo = {
  cat: {
    title: "That is a Cat 🐱",
    description: "A cat is a small, carnivorous domestic animal (Felis catus) that is commonly kept as a pet.",
    facts: [
      "🧠 Intelligent & curious",
      "💤 Sleeps 12–16 hours a day",
      "🐾 Very clean animals (self-grooming)",
      "🎧 Can hear high-frequency sounds",
      "❤️ Known for being independent but affectionate"
    ],
    types: [
      "Domestic cats (pets)",
      "Wild cats (like lions, tigers, leopards)"
    ],
    breeds: [
      "Persian",
      "Siamese",
      "Maine Coon",
      "Bengal"
    ]
  },
  dog: {
    title: "That is a Dog 🐶",
    description: "A dog is a loyal and intelligent domestic animal, often called man's best friend. Dogs are known for their strong bond with humans and their ability to protect, assist, and love unconditionally.",
    facts: [
      "🧠 Highly intelligent & trainable",
      "❤️ Very loyal and friendly",
      "👃 Strong sense of smell",
      "🏃‍♂️ Needs daily exercise",
      "👨‍👩‍👧 Great family companions"
    ],
    types: [
      "Pet dogs (Labrador, Pug, German Shepherd)",
      "Working dogs (Police, Army, Guard dogs)",
      "Service dogs (Guide dogs, Therapy dogs)"
    ],
    breeds: [
      "Labrador Retriever",
      "German Shepherd",
      "Golden Retriever",
      "Beagle",
      "Pug"
    ]
  },
  elephant: {
    title: "That is an Elephant 🐘",
    description: "An elephant is the largest land animal on Earth. It is a gentle, intelligent, and social animal known for its long trunk and strong memory.",
    facts: [
      "🧠 Very intelligent with excellent memory",
      "🐘 Largest land animal in the world",
      "👃 Uses its trunk to breathe, drink water, pick food, and communicate",
      "❤️ Highly emotional and social animals",
      "🌿 Herbivore (eats grass, fruits, leaves, bark)"
    ],
    types: [
      "African Elephant",
      "Asian Elephant"
    ],
    specialFeatures: [
      "Long trunk",
      "Large ears",
      "Tusks (ivory)",
      "Thick skin"
    ]
  },
  lion: {
    title: "That is a Lion 🦁",
    description: "A lion is a large, powerful wild animal known as the King of the Jungle. It is a carnivorous mammal that lives mainly in groups called prides.",
    facts: [
      "👑 Known as the King of the Jungle",
      "🧠 Intelligent and strategic hunter",
      "🐾 Lives in groups called prides",
      "🦷 Sharp teeth and strong claws",
      "🗣️ A lion's roar can be heard up to 8 km away"
    ],
    types: [
      "African Lion",
      "Asiatic Lion"
    ],
    specialFeatures: [
      "Male lions have a thick mane",
      "Strong muscular body",
      "Excellent night vision",
      "Powerful roar"
    ]
  },
  tiger: {
    title: "That is a Tiger 🐯",
    description: "A tiger is a large, strong wild animal and the largest member of the cat family. It is known for its orange fur with black stripes and powerful hunting skills.",
    facts: [
      "🐯 Largest wild cat in the world",
      "🧠 Intelligent and patient hunter",
      "🌙 Mostly active at night (nocturnal)",
      "🦷 Sharp teeth and strong claws",
      "🏃 Can run very fast for short distances"
    ],
    types: [
      "Bengal Tiger",
      "Siberian Tiger",
      "Sumatran Tiger"
    ],
    specialFeatures: [
      "Unique black stripes (no two tigers are the same)",
      "Strong muscular body",
      "Excellent swimming ability",
      "Sharp eyesight and hearing"
    ]
  }
};

function PremiumImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (image && image.type.startsWith('image/')) {
      setFile(image);
      setPreview(URL.createObjectURL(image));
      setResult("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult("");
    }
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }
    setLoading(true);
    setResult("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.animal);
    } catch (err) {
      setResult("error");
    }
    setLoading(false);
  };

  const info = animalInfo[result] || null;

  return (
    <div className="premium-container-full">
      {!result ? (
        // Upload Section
        <div className="premium-card">
          <div className="premium-title">🐾 Animal Detector</div>
          <div className="premium-subtitle">Upload an image to predict the animal!</div>
          <div className="premium-controls">
            <div 
              className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="drag-drop-icon">🐉</div>
              <div className="drag-drop-text">
                {isDragging ? 'Drop your image here!' : 'Drag & Drop your image here'}
              </div>
              <div className="drag-drop-or">or</div>
              <label className="file-input-label">
                <input
                  className="premium-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                Choose File
              </label>
            </div>
            {preview && (
              <img className="premium-preview" src={preview} alt="preview" />
            )}
            <button className="premium-btn" onClick={handlePredict} disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </div>
      ) : (
        // Result Section - Two Column Layout
        <div className="result-container">
          <div className="result-image-section">
            <img src={preview} alt="uploaded" className="result-image" />
          </div>
          <div className="result-info-section">
            <h1 className="result-title">{info?.title}</h1>
            <p className="result-description">{info?.description}</p>
            
            <h3 className="info-heading">Key facts:</h3>
            <ul className="facts-list">
              {info?.facts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>

            <h3 className="info-heading">Types of {result}s:</h3>
            <ul className="types-list">
              {info?.types.map((type, idx) => (
                <li key={idx}>{type}</li>
              ))}
            </ul>

            {info?.breeds && (
              <>
                <h3 className="info-heading">Common breeds:</h3>
                <ul className="breeds-list">
                  {info?.breeds.map((breed, idx) => (
                    <li key={idx}>{breed}</li>
                  ))}
                </ul>
              </>
            )}

            {info?.specialFeatures && (
              <>
                <h3 className="info-heading">Special Features:</h3>
                <ul className="special-features-list">
                  {info?.specialFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </>
            )}

            <button className="premium-btn back-btn" onClick={() => {
              setFile(null);
              setPreview(null);
              setResult("");
            }}>
              Upload Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumImageUpload;
