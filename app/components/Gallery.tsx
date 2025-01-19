"use client"

import { InfiniteSlider } from "./ui/infinite-slider";
import Image from 'next/image';
import { useState } from 'react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    '/image1.jpeg',
    '/image2.jpeg',
    '/image3.jpeg',
    '/image4.jpeg',
    '/image5.jpeg',
    '/image6.jpeg',
    '/image7.jpeg',
    '/image8.jpeg',
    '/image9.jpeg',
    '/image10.jpeg'
  ];

  return (
    <section id="gallery" className="min-h-screen py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
      <div className="w-full max-w-7xl mx-auto">
        {/* Horizontal slider */}
        <InfiniteSlider gap={24} duration={30} durationOnHover={75} className="h-[400px]">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="relative aspect-square h-full cursor-pointer"
              onClick={() => setSelectedImage(src)}
            >
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                width={300}
                height={300}
                className="rounded-xl object-cover"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>

      {/* Modal/Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 text-xl"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Selected gallery image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 