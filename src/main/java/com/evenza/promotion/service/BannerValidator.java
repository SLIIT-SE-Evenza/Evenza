package com.evenza.promotion.service;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.MemoryCacheImageInputStream;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

/**
 * Validates uploaded promotion banners and converts them to PNG.
 */
@Component
public class BannerValidator {

    private static final long MAX_UPLOAD_BYTES =
            2L * 1024 * 1024;

    private static final int MAX_DIMENSION = 4096;

    private static final long MAX_PIXELS = 8_000_000L;

    private static final int MAX_NORMALIZED_BYTES =
            8 * 1024 * 1024;

    /**
     * Returns validated PNG bytes.
     *
     * Returns null when no new banner was selected.
     * The calling service can then keep the existing banner.
     */
    public byte[] normalize(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (file.getSize() > MAX_UPLOAD_BYTES) {
            throw new IllegalArgumentException(
                    "Banner must be 2 MB or smaller."
            );
        }

        try (
                InputStream source = file.getInputStream();
                MemoryCacheImageInputStream input =
                        new MemoryCacheImageInputStream(source)
        ) {
            Iterator<ImageReader> readers =
                    ImageIO.getImageReaders(input);

            if (!readers.hasNext()) {
                throw new IllegalArgumentException(
                        "Upload a valid PNG or JPEG image."
                );
            }

            ImageReader reader = readers.next();

            try {
                reader.setInput(input, true, true);

                validateFormat(reader.getFormatName());

                int width = reader.getWidth(0);
                int height = reader.getHeight(0);

                validateDimensions(width, height);

                BufferedImage image = reader.read(0);

                if (image == null) {
                    throw new IllegalArgumentException(
                            "The banner image could not be decoded."
                    );
                }
                try {
                    return encodeAsPng(image);
                } finally {
                    image.flush();
                }

            } finally {
                reader.dispose();
            }

        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Banner could not be read. Upload a valid PNG or JPEG.",
                    exception
            );
        }
    }
    /**
     * Checks the format detected from the file content.
     * The filename extension and browser MIME type are not trusted.
     */
    private void validateFormat(String format) {
        boolean supported =
                "PNG".equalsIgnoreCase(format)
                        || "JPEG".equalsIgnoreCase(format);

        if (!supported) {
            throw new IllegalArgumentException(
                    "Only PNG and JPEG banners are supported."
            );
        }
    }
    /**
     * Checks dimensions before decoding the full image.
     */
    private void validateDimensions(int width, int height) {
        if (width < 1 || height < 1) {
            throw new IllegalArgumentException(
                    "Banner dimensions are invalid."
            );
        }

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            throw new IllegalArgumentException(
                    "Banner width and height must not exceed 4096 pixels."
            );
        }

        long totalPixels = (long) width * height;

        if (totalPixels > MAX_PIXELS) {
            throw new IllegalArgumentException(
                    "Banner must not exceed 8 megapixels."
            );
        }
    }
    private byte[] encodeAsPng(BufferedImage image) throws IOException {
        try (
                ByteArrayOutputStream output =
                        new ByteArrayOutputStream()
        ) {
            boolean written = ImageIO.write(image, "png", output);

            if (!written) {
                throw new IllegalArgumentException(
                        "The banner could not be converted to PNG."
                );
            }

            if (output.size() > MAX_NORMALIZED_BYTES) {
                throw new IllegalArgumentException(
                        "The converted banner is too large. "
                                + "Choose a smaller image."
                );
            }

            return output.toByteArray();
        }
    }
}


