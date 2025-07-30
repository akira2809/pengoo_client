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

  // Remove leading slash if present
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Construct the Cloudinary URL with transformations
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`
  ];
  
  return `https://res.cloudinary.com/do6lj4onq/image/upload/${params.join(',')}/${cleanSrc}`;
}
