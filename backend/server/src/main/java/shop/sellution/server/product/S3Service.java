package shop.sellution.server.product;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {
    //private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Autowired
    private CompanyRepository companyRepository;

    public String uploadFile(MultipartFile file, Long companyId, String folderType) throws IOException {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        String companyName = company.getName(); // 회사 이름 가져오기
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = String.format("%s/%s/%s", companyName, folderType, fileName);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, file.getInputStream(), metadata));
            String fileUrl = amazonS3.getUrl(bucket, filePath).toString();
            //logger.info("File uploaded successfully to S3. URL: {}", fileUrl);
            return fileUrl;
        } catch (AmazonServiceException e) {
            //logger.error("Error uploading file to S3: {}", e.getMessage());
            throw e;
        }
    }

    public String uploadQRCode(byte[] qrCode, Long companyId) throws IOException {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        String companyName = company.getName();
        String fileName = UUID.randomUUID().toString() + "_qr_code.png";
        String filePath = String.format("%s/QR/%s", companyName, fileName);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/png");
        metadata.setContentLength(qrCode.length);

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(qrCode)) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, metadata));
            return amazonS3.getUrl(bucket, filePath).toString(); // Return the S3 URL
        } catch (AmazonServiceException e) {
            throw e;
        }
    }


    public void deleteFile(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(bucket, fileName);
    }


}
