// ImageUpload.tsx
import React, { useState } from 'react';

const ImageUpload = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleUpload = async () => {
        if (!image) return;

        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "buen_sabor"); //cambiar a tienda_ropa para el proyeto de base de datos
                                        //son carpetas distintas

        const res = await fetch(`https://api.cloudinary.com/v1_1/dvyjtb1ns/image/upload`, {
            method: "POST",
            body: data,
        });

        const file = await res.json();
        setImageUrl(file.secure_url);
        console.log(file.secure_url);
    };

    return (
        <div>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <button onClick={handleUpload}>Subir</button>

            {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
        </div>
    );
};

export default ImageUpload;
