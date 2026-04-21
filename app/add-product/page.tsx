"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://beikebeotzgurxqkgpdw.supabase.co";
const supabaseKey = "sb_publishable_rw37qogGhg7VV90K_jOIbw_o8gT55Zq";

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          description,
          image: imageUrl,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setMessage("Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);

      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Add Product</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={styles.input}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Adding..." : "Add Product"}
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minHeight: "100px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
};