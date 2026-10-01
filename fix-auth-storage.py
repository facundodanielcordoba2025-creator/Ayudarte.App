import re

with open('components/AuthModal.tsx', 'r') as f:
    c = f.read()

# Add import
if 'uploadToCloudinary' not in c:
    c = c.replace('import { db, storage } from "@/lib/firebase";', 'import { db } from "@/lib/firebase";\nimport { uploadToCloudinary } from "@/lib/cloudinary";')

old_storage = """      if (companyLogo) {
        setUploadingLogo(true);
        const fileExt = companyLogo.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const storageRef = ref(storage, `logos/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, companyLogo);
        
        await uploadTask;
        logoUrl = await getDownloadURL(uploadTask.ref);
      }"""

new_storage = """      if (companyLogo) {
        setUploadingLogo(true);
        logoUrl = await uploadToCloudinary(companyLogo);
      }"""

c = c.replace(old_storage, new_storage)

with open('components/AuthModal.tsx', 'w') as f:
    f.write(c)
