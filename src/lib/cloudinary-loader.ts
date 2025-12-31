export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If the image is already a full URL, return it as is
  if (src.startsWith('http')) {
    return src;
  }

  // For local images in public folder
  if (src.startsWith('/')) {
    return src;
  }

  // For Cloudinary images
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`
  ];
  
  return `https://res.cloudinary.com/do6lj4onq/image/upload/${params.join(',')}/${src}`;
}
