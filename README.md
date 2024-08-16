# Image Entropy Calculator
This is an online tool which takes an image (PNG, JPEG, WEBP) as an input and calculates the Shannon Entropy (https://en.wikipedia.org/wiki/Entropy_(information_theory)) of the image, then compresses the image using lossless PNG compression, then compares the sizes of the compressed and original image. 

Theoretically, the compression percentage of an image is inversely proportional to the Shannon Entropy of said image because conceptually, having a higher Shannon Entropy means the image has more randomness and chaos, leaving less patterns to exploit for efficient compression leading to a larger compressed file size.

## Available Online
Deployed: https://entropy-image-project.vercel.app/

## Purpose
Built as part of the course project for SYDE 381: Thermodynamics 1 in Summer 2024 at the University of Waterloo as a demonstration of the abstract concept of entropy. 
