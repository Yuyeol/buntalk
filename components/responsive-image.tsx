import Image from 'next/image'

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio,
}: {
  src: string
  alt: string
  aspectRatio?: string
}) {
  return (
    <div className={`relative`} style={{ aspectRatio }}>
      <Image fill src={src} alt={alt} className=" object-cover" />
    </div>
  )
}
