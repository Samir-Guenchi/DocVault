package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.util.UUID;

/**
 * Service for uploading files to MinIO (S3-compatible storage)
 */
@Service
public class S3StorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3StorageService.class);

    @Value("${s3.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${s3.access-key:minioadmin}")
    private String accessKey;

    @Value("${s3.secret-key:minioadmin}")
    private String secretKey;

    @Value("${s3.bucket:dms-documents}")
    private String bucketName;

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        try {
            this.s3Client = S3Client.builder()
                    .endpointOverride(URI.create(endpoint))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .region(Region.US_EAST_1)
                    .forcePathStyle(true)
                    .build();

            // Ensure bucket exists
            try {
                s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
                logger.info("S3 bucket '{}' already exists", bucketName);
            } catch (NoSuchBucketException e) {
                s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
                logger.info("Created S3 bucket '{}'", bucketName);
            }

            logger.info("S3 Storage Service initialized — endpoint: {}", endpoint);
        } catch (Exception e) {
            logger.warn("S3 Storage Service initialization failed (MinIO may not be running): {}", e.getMessage());
            this.s3Client = null;
        }
    }

    /**
     * Upload a file to S3/MinIO
     *
     * @param file the multipart file to upload
     * @return the S3 URL of the uploaded file, or null if S3 is unavailable
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (s3Client == null) {
            logger.warn("S3 client not available — skipping file upload");
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique key: yyyy/MM/uuid.ext
        String key = java.time.LocalDate.now().toString().replace("-", "/")
                + "/" + UUID.randomUUID() + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String fileUrl = endpoint + "/" + bucketName + "/" + key;
        logger.info("File uploaded to S3: {}", fileUrl);

        return fileUrl;
    }

    /**
     * Check if S3 storage is available
     */
    public boolean isAvailable() {
        return s3Client != null;
    }
}
