import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [entropy, setEntropy] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      calculateEntropy(ctx, img.width, img.height);
    };
    img.src = URL.createObjectURL(file);
    setImageSrc(URL.createObjectURL(file));
  };

  const calculateEntropy = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const entropyR = calculateChannelEntropy(data, 0);
    const entropyG = calculateChannelEntropy(data, 1);
    const entropyB = calculateChannelEntropy(data, 2);

    const totalEntropy = entropyR + entropyG + entropyB;
    setEntropy(totalEntropy.toFixed(4));
  };

  const calculateChannelEntropy = (data, channel) => {
    const channelData = [];
    for (let i = channel; i < data.length; i += 4) {
      channelData.push(data[i]);
    }

    const counts = {};
    for (const value of channelData) {
      counts[value] = (counts[value] || 0) + 1;
    }

    const totalPixels = channelData.length;
    let entropy = 0;
    for (const count of Object.values(counts)) {
      const p = count / totalPixels;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  };

  return (
    <div className="App">
      <h1>Image Entropy Calculator</h1>
      <div className="image-container">
        <input type="file" onChange={handleImageUpload} accept="image/jpeg, image/png, image/webp" />
        {imageSrc && <img src={imageSrc} alt="Uploaded" id="uploadedImage" />}
        {entropy && <div id="entropyOutput" className="title">Entropy: {entropy}</div>}
      </div>
    </div>
  );
};

export default App;