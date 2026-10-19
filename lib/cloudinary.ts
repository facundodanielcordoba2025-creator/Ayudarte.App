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

  // "auto" acepta imágenes y videos (el formulario de sueños permite ambos).
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

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
      throw new Error(errData?.error?.message || "Error al subir imagen a Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    // Fallback seguro a Data URL para imágenes o documentos adjuntos
    // asegurando que nunca se bloquee el registro ni la publicación
    if (file && file.size <= 10 * 1024 * 1024) {
      try {
        console.warn("Usando fallback Data URL para archivo:", file.name);
        return await fileToDataUrl(file);
      } catch (fallbackErr) {
        console.error("Fallback Data URL falló:", fallbackErr);
      }
    }
    throw error;
  }
}
