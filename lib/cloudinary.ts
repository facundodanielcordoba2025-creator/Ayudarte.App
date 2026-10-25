// Helper para convertir archivo a Data URL como fallback en caso de error de red o preset
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = "dffhpwfiz";
  const uploadPreset = "ml_default";

  const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|avi|m4v)$/i);
  const resourceType = isVideo ? "video" : "auto";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      console.warn("Cloudinary error response:", errData);
      throw new Error(errData?.error?.message || "Error al subir archivo a Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    // Fallback a Data URL solo para imágenes livianas (nunca para videos grandes porque exceden Firestore)
    if (!isVideo && file && file.size <= 2 * 1024 * 1024) {
      try {
        console.warn("Usando fallback Data URL para imagen liviana:", file.name);
        return await fileToDataUrl(file);
      } catch (fallbackErr) {
        console.error("Fallback Data URL falló:", fallbackErr);
      }
    }
    throw error;
  }
}
