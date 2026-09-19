import cloudinary from "../config/cloudinary.js";

export const getCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    const parsedUrl = new URL(url);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const segments = pathname.split("/").filter(Boolean);

    if (!segments.length) return null;

    const hasCloudinaryResourceType = ["image", "video", "raw", "auto"].includes(segments[0]);
    if (!hasCloudinaryResourceType) return null;

    let index = 1;
    if (["upload", "fetch", "private"].includes(segments[index])) {
      index += 1;
    }

    if (segments[index]?.startsWith("v")) {
      index += 1;
    }

    const publicIdWithExtension = segments.slice(index).join("/");
    if (!publicIdWithExtension) return null;

    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error parseando URL de Cloudinary:", error);
    return null;
  }
};

export const deleteCloudinaryResourceByUrl = async (url, resourceType = "image") => {
  if (!url) {
    return { deleted: false, reason: "missing-url" };
  }

  const publicId = getCloudinaryPublicId(url);
  if (!publicId) {
    return { deleted: false, reason: "not-cloudinary-url" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

    return {
      deleted: ["ok", "not found"].includes(result?.result),
      result,
      publicId,
    };
  } catch (error) {
    console.error("Error eliminando recurso de Cloudinary:", error);
    return { deleted: false, reason: "destroy-error", publicId, error };
  }
};

export const deleteCloudinaryResourcesByUrls = async (urls = [], resourceType = "image") => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return [];
  }

  const uniqueUrls = [...new Set(urls.filter(Boolean))];

  const results = await Promise.all(
    uniqueUrls.map((url) => deleteCloudinaryResourceByUrl(url, resourceType))
  );

  return results;
};
