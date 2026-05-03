import { useEffect, useState } from "react";
import api from "../../service/api";

interface AuthImageProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
}

export function AuthImage({
  src,
  alt,
  fallback,
  className,
}: AuthImageProps) {
  const [imageSrc, setImageSrc] = useState(fallback);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadImage = async () => {
      if (!src) {
        setImageSrc(fallback);
        return;
      }

      try {
        const response = await api.get(src, {
          responseType: "blob",
        });

        objectUrl = URL.createObjectURL(response.data);
        setImageSrc(objectUrl);
      } catch (error) {
        console.error("Erro ao carregar imagem protegida", error);
        setImageSrc(fallback);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fallback, src]);

  return <img src={imageSrc} alt={alt} className={className} />;
}
