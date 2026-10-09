export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = "dffhpwfiz";
  const uploadPreset = "ayudarte_app";

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
      throw new Error("Error al subir imagen a Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}
