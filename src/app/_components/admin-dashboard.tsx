"use client";

import { useState, useRef } from "react";
import type { Product } from "@prisma/client";

import { api } from "~/trpc/react";

export function AdminDashboard() {
  const [newTypology, setNewTypology] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    imageUrl: "",
    typology: "",
    weight: "",
    height: "",
    width: "",
    length: "",
  });
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; alt?: string }>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "typologies" | "banners">("products");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerAltText, setBannerAltText] = useState("");
  const fileInputBannerRef = useRef<HTMLInputElement>(null);

  const { data: products, refetch } = api.product.getAll.useQuery();
  const { data: typologies = [], refetch: refetchTypologies } = api.typology.getAll.useQuery();
  const { data: banners = [], refetch: refetchBanners } = api.banner.getAll.useQuery();

  const createMutation = api.product.create.useMutation({
    onSuccess: () => {
      resetForm();
      void refetch();
      setSuccessMessage("Prodotto creato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const updateMutation = api.product.update.useMutation({
    onSuccess: () => {
      resetForm();
      void refetch();
      setSuccessMessage("Prodotto aggiornato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const deleteMutation = api.product.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setSuccessMessage("Prodotto eliminato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const createTypologyMutation = api.typology.create.useMutation({
    onSuccess: () => {
      void refetchTypologies();
      setNewTypology("");
      setSuccessMessage("Tipologia aggiunta!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      setSuccessMessage(`${error.message}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const deleteTypologyMutation = api.typology.delete.useMutation({
    onSuccess: () => {
      void refetchTypologies();
      setSuccessMessage("Tipologia rimossa!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const upsertBannerMutation = api.banner.upsert.useMutation({
    onSuccess: () => {
      setBannerImageUrl("");
      setBannerAltText("");
      void refetchBanners();
      setSuccessMessage("Banner aggiornato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const deleteBannerMutation = api.banner.delete.useMutation({
    onSuccess: () => {
      void refetchBanners();
      setSuccessMessage("Banner eliminato!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discount: "",
      imageUrl: "",
      typology: "",
      weight: "",
      height: "",
      width: "",
      length: "",
    });
    setUploadedImages([]);
    setEditingId(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: Array<{ url: string; alt?: string }> = [];
    let loadedCount = 0;

    Array.from(files).forEach((file) => {
      // Check file size (max 2MB per file)
      if (file.size > 2 * 1024 * 1024) {
        alert(`Il file ${file.name} è troppo grande. Massimo 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        newImages.push({ url: base64, alt: file.name });
        loadedCount++;

        // Quando tutti i file sono stati caricati, aggiorna lo state una sola volta
        if (loadedCount === Array.from(files).length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          // Set the first image as main imageUrl if we don't have one
          if (uploadedImages.length === 0 && newImages.length > 0 && newImages[0]) {
            setFormData((prev) => ({
              ...prev,
              imageUrl: newImages[0].url,
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the first image and have more, update main imageUrl
      if (index === 0 && newImages.length > 0 && newImages[0]) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: newImages[0].url,
        }));
      }
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Il nome del prodotto è obbligatorio");
      return;
    }

    // Validate discount if provided
    if (formData.discount) {
      const discountNum = parseFloat(formData.discount);
      if (discountNum < 0 || discountNum > 100) {
        alert("Lo sconto deve essere tra 0 e 100%");
        return;
      }
    }

    const input = {
      name: formData.name,
      description: formData.description || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      imageUrl: formData.imageUrl || undefined,
      typology: formData.typology || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      width: formData.width ? parseFloat(formData.width) : undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
      mediaUrls: uploadedImages.length > 0 ? uploadedImages.map(img => img.url) : undefined,
    };

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: input,
      });
    } else {
      await createMutation.mutateAsync(input);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price?.toString() || "",
      discount: (product as any).discount?.toString() || "",
      imageUrl: product.imageUrl || "",
      typology: (product as any).typology || "",
      weight: (product as any).weight?.toString() || "",
      height: (product as any).height?.toString() || "",
      width: (product as any).width?.toString() || "",
      length: (product as any).length?.toString() || "",
    });

    // Mostra le immagini dal database (media) o quella vecchia (imageUrl)
    if (product.media && product.media.length > 0) {
      setUploadedImages(
        product.media.map((m: any) => ({
          url: m.url,
          alt: m.alt || product.name
        }))
      );
    } else if (product.imageUrl) {
      setUploadedImages([{ url: product.imageUrl, alt: product.name }]);
    } else {
      setUploadedImages([]);
    }

    setEditingId(product.id);
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      void deleteMutation.mutateAsync({ id });
    }
  };

  const handleAddTypology = () => {
    if (!newTypology.trim()) {
      alert("Inserisci una tipologia");
      return;
    }
    void createTypologyMutation.mutateAsync({ name: newTypology });
  };

  const handleRemoveTypology = (typologyName: string) => {
    void deleteTypologyMutation.mutateAsync({ name: typologyName });
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="flex flex-col gap-8">
      {/* Info Section */}
      <section className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-8 animate-in fade-in slide-in-from-left-4 duration-700">
        <h2 className="mb-3 text-2xl font-bold bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
          Gestione Catalogo
        </h2>
        <p className="text-gray-700">
          Gestisci i tuoi prodotti, le tipologie e carica immagini direttamente dal tuo dispositivo.
        </p>
      </section>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 animate-in fade-in slide-in-from-top-2 duration-500 font-medium">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 max-w-4xl">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 font-bold transition-all duration-300 border-b-2 ${
            activeTab === "products"
              ? "border-yellow-600 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Prodotti
        </button>
        <button
          onClick={() => setActiveTab("typologies")}
          className={`px-6 py-3 font-bold transition-all duration-300 border-b-2 ${
            activeTab === "typologies"
              ? "border-yellow-600 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Tipologie
        </button>
        <button
          onClick={() => setActiveTab("banners")}
          className={`px-6 py-3 font-bold transition-all duration-300 border-b-2 ${
            activeTab === "banners"
              ? "border-yellow-600 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Banner
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {/* Form */}
          <section className="max-w-4xl rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
                {editingId ? "Modifica" : "Nuovo Prodotto"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  Annulla
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Nome Prodotto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Materasso Memory Foam Premium"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Descrizione */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Descrizione
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Descrivi le caratteristiche principali..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Grid: Price, Discount, Typology */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Prezzo (€)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="299.99"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Sconto (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="10"
                    value={formData.discount}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="typology" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Tipologia
                  </label>
                  <select
                    id="typology"
                    name="typology"
                    value={formData.typology}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Seleziona tipologia...</option>
                    {typologies.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Specifications - Weight, Height, Width, Length */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    placeholder="25.5"
                    value={formData.weight}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Altezza (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    placeholder="30"
                    value={formData.height}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="width" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Larghezza (cm)
                  </label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    placeholder="160"
                    value={formData.width}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="length" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Lunghezza (cm)
                  </label>
                  <input
                    type="number"
                    id="length"
                    name="length"
                    placeholder="200"
                    value={formData.length}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    step="0.1"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image Upload - Multiple */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Carica Immagini (puoi aggiungere più di una)
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={isLoading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#866f59] file:text-white hover:file:bg-[#7a5d47]"
                    />
                  </div>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-32 rounded-lg border-2 border-gray-200 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all"
                              title="Rimuovi immagine"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-1 right-1 bg-[#866f59] text-white text-xs px-2 py-1 rounded-md font-bold">
                              Principale
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      {uploadedImages.length} immagine{uploadedImages.length !== 1 ? 'i' : ''} caricate
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold py-2.5 text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "..." : editingId ? "Aggiorna" : "Aggiungi"}
                </button>
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <p className="text-red-600 text-sm font-medium">
                  {createMutation.error?.message || updateMutation.error?.message}
                </p>
              )}
            </form>
          </section>

          {/* Catalogo */}
          <section className="max-w-7xl">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
                Catalogo
              </h2>
              <p className="text-gray-600">
                Totale: <span className="font-bold text-gray-900">{products?.length ?? 0}</span> prodotti
              </p>
            </div>

            {!products || products.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center bg-gray-50">
                <p className="text-xl text-gray-500 font-medium">Nessun prodotto</p>
                <p className="text-gray-400 mt-2">Aggiungi il primo prodotto per iniziare</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image */}
                    {product.imageUrl && (
                      <div className="relative overflow-hidden bg-gray-100 h-40">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {product.name}
                      </h3>

                      {(product as any).typology && (
                        <p className="text-xs font-semibold text-yellow-600 mb-2 uppercase tracking-wide">
                          {(product as any).typology}
                        </p>
                      )}

                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {product.price && (
                        <div className="mb-4">
                          {(product as any).discount && (product as any).discount > 0 ? (
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-gray-500 line-through">
                                €{product.price.toFixed(2)}
                              </p>
                              <p className="text-xl font-bold text-red-600">
                                €{(product.price * (1 - (product as any).discount / 100)).toFixed(2)}
                              </p>
                              <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">
                                -{(product as any).discount}%
                              </span>
                            </div>
                          ) : (
                            <p className="text-xl font-bold text-yellow-600">
                              €{product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isLoading}
                          className="flex-1 rounded-lg bg-blue-50 text-blue-600 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:bg-blue-100 disabled:opacity-50 hover:scale-105 active:scale-95"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isLoading}
                          className="flex-1 rounded-lg bg-red-50 text-red-600 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:bg-red-100 disabled:opacity-50 hover:scale-105 active:scale-95"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Typologies Tab */}
      {activeTab === "typologies" && (
        <section className="max-w-4xl rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent mb-6">
            Gestione Tipologie
          </h2>

          {/* Add Typology */}
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Aggiungi Nuova Tipologia</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTypology}
                onChange={(e) => setNewTypology(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTypology()}
                placeholder="Es: Premium Plus, Eco-friendly..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button
                onClick={handleAddTypology}
                className="px-6 py-2.5 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Aggiungi
              </button>
            </div>
          </div>

          {/* List Typologies */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tipologie Disponibili</h3>
            {!typologies || typologies.length === 0 ? (
              <p className="text-gray-500">Nessuna tipologia. Aggiungine una!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {typologies.map((typology) => (
                  <div
                    key={typology.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <span className="font-medium text-gray-900">{typology.name}</span>
                    <button
                      onClick={() => handleRemoveTypology(typology.name)}
                      disabled={deleteTypologyMutation.isPending}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 disabled:opacity-50"
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Banners Tab */}
      {activeTab === "banners" && (
        <section className="max-w-4xl rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent mb-6">
            Gestione Banner
          </h2>

          {/* Upload Banner Form */}
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Carica Nuovo Banner</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Immagine Banner
                </label>
                <input
                  ref={fileInputBannerRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBannerImageUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#866f59] file:text-white hover:file:bg-[#7a5d47]"
                />
              </div>

              <div>
                <label htmlFor="bannerAlt" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Testo Alternativo
                </label>
                <input
                  type="text"
                  id="bannerAlt"
                  placeholder="Descrizione alternativa per accessibilità"
                  value={bannerAltText}
                  onChange={(e) => setBannerAltText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {bannerImageUrl && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Anteprima</p>
                  <img src={bannerImageUrl} alt="Anteprima banner" className="max-h-40 rounded-lg object-contain" />
                </div>
              )}

              <button
                onClick={async () => {
                  if (!bannerImageUrl) {
                    alert("Carica un'immagine per il banner");
                    return;
                  }
                  try {
                    await upsertBannerMutation.mutateAsync({
                      imageUrl: bannerImageUrl,
                      altText: bannerAltText || undefined,
                    });
                  } catch (error) {
                    console.error("Banner save error:", error);
                    alert("Errore nel salvataggio del banner");
                  }
                }}
                disabled={upsertBannerMutation.isPending}
                className="w-full rounded-lg bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold py-2.5 text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upsertBannerMutation.isPending ? "Salvataggio..." : "Salva Banner"}
              </button>
            </div>
          </div>

          {/* Banners List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Banner Caricati</h3>
            {!banners || banners.length === 0 ? (
              <p className="text-gray-500">Nessun banner caricato</p>
            ) : (
              <div className="space-y-4">
                {banners.map((banner: any) => (
                  <div
                    key={banner.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {banner.imageUrl && (
                          <img src={banner.imageUrl} alt={banner.altText} className="max-h-24 rounded-lg object-contain mb-2" />
                        )}
                        <div className="text-sm">
                          <p className="text-gray-600">
                            Alt text: <span className="font-medium">{banner.altText || "Non disponibile"}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: {banner.active ? (
                              <span className="font-bold text-green-600">Attivo</span>
                            ) : (
                              <span className="font-bold text-gray-500">Inattivo</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => void deleteBannerMutation.mutateAsync({ id: banner.id })}
                        disabled={deleteBannerMutation.isPending}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 disabled:opacity-50"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
