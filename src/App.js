import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [compressedImageSrc, setCompressedImageSrc] = useState(null);
  const [entropy, setEntropy] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressionPercent, setCompressionPercent] = useState(null);
  const [originalBlob, setOriginalBlob] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);

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
      compressAndCalculateSize(canvas, ctx, img.width, img.height, file);
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

  const compressAndCalculateSize = (canvas, ctx, width, height, originalFile) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const originalSize = data.length;
    setOriginalSize(originalSize);

    // Create a blob for the original image
    setOriginalBlob(URL.createObjectURL(originalFile));

    // Create a blob for the compressed image
    canvas.toBlob((blob) => {
      setCompressedBlob(URL.createObjectURL(blob));
      const compressedSize = blob.size;
      setCompressedSize(compressedSize);

      const compressionPercent = ((originalSize - compressedSize) / originalSize) * 100;
      setCompressionPercent(compressionPercent.toFixed(2));
      setCompressedImageSrc(URL.createObjectURL(blob));
    }, 'image/png');
  };

  const data = {
    labels: ['Original Size', 'Compressed Size'],
    datasets: [
      {
        label: 'File Size (bytes)',
        data: [originalSize, compressedSize],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="App">
      <h1>Image Entropy Calculator V2</h1>
      <div className="image-container">
        <input type="file" onChange={handleImageUpload} accept="image/jpeg, image/png, image/webp" />
        <div className="images-display">
          <div>
            {imageSrc && <img src={imageSrc} alt="Original" id="originalImage" />}
            {imageSrc && <div className="image-label">Original Image</div>}
          </div>
          <div>
            {compressedImageSrc && <img src={compressedImageSrc} alt="Compressed" id="compressedImage" />}
            {compressedImageSrc && <div className="image-label">Compressed Image</div>}
          </div>
        </div>
        {entropy && <div id="entropyOutput" className="title">Shannon Entropy: {entropy}</div>}
        {originalSize && compressedSize && (
          <div>
            <Bar data={data} options={options} />
            <div id="compressionOutput" className="title">
              Compression Percentage: {compressionPercent}% <br /> <br />
              Compression Algorithm: PNG Compression, Lossless
            </div>
            <div className="download-links">
              <a href={originalBlob} download="original_image.png">Download Original Image</a>
              <a href={compressedBlob} download="compressed_image.png">Download Compressed Image</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
