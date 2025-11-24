// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate file type
 */
export function validateFileType(file: File): ValidationResult {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
        };
    }
    return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): ValidationResult {
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}. Please upload a smaller file.`,
        };
    }
    return { valid: true };
}

/**
 * Validate file (type and size)
 */
export function validateFile(file: File): ValidationResult {
    const typeValidation = validateFileType(file);
    if (!typeValidation.valid) return typeValidation;

    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) return sizeValidation;

    return { valid: true };
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
