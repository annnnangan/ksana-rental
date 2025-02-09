export const allowedImageMineTypes = ["image/jpeg", "image/jpg", "image/png"];

export const formattedMineTypes = allowedImageMineTypes.map((type) =>
  type.replace("image/", "")
);

export const maxCoverAndLogoImageSize = 1048576 * 2; // 2 MB
export const maxCoverImageSize = 1048576 * 2; // 2 MB;
export const maxLogoImageSize = 1048576 * 2; // 2 MB;
export const maxGalleryImageSize = 1048576 * 5; // 5 MB
export const maxReviewImageSize = 1048576 * 1; // 1 MB
export const maxPayoutImageSize = 1048576 * 1; // 1 MB

export const maxImageSizes: Record<string, number> = {
  cover: maxCoverImageSize, // 2MB
  logo: maxLogoImageSize, // 2MB
  gallery: maxGalleryImageSize, // 5MB
  review: maxReviewImageSize, // 1MB
  payout: maxPayoutImageSize, // 1MB
};

export type ImageType = keyof typeof maxImageSizes;

export const maxReviewImageCount = 5;
