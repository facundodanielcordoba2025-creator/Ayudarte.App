with open('app/regalar/page.tsx', 'r') as f:
    c = f.read()

# Add import
if 'uploadToCloudinary' not in c:
    c = c.replace('import { db } from "@/lib/firebase";', 'import { db } from "@/lib/firebase";\nimport { uploadToCloudinary } from "@/lib/cloudinary";')

old_storage = """      let imageUrl = "";
      if (imageFile) {
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const { storage } = await import('@/lib/firebase');
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const storageRef = ref(storage, `gifts/${fileName}`);
        
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);
        imageUrl = url;
      }"""

new_storage = """      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }"""

c = c.replace(old_storage, new_storage)

with open('app/regalar/page.tsx', 'w') as f:
    f.write(c)
