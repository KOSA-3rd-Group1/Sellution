package shop.sellution.server.product;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.type.ImagePurposeType;
import shop.sellution.server.global.util.MeasureExecutionTime;
import shop.sellution.server.product.domain.ProductImageType;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class S3Service {
    private final AmazonS3 amazonS3;
    private final CompanyRepository companyRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Autowired
    public S3Service(AmazonS3 amazonS3, CompanyRepository companyRepository) {
        this.amazonS3 = amazonS3;
        this.companyRepository = companyRepository;
    }

    @MeasureExecutionTime
    public String uploadFile(MultipartFile file, Long companyId, String folderType, Enum<?> imageType) throws IOException {
//        System.out.println("Uploading file: " + file.getOriginalFilename());
//        System.out.println("Company ID: " + companyId);
//        System.out.println("Folder type: " + folderType);
//        System.out.println("Image type: " + imageType);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        String companyName = company.getName();
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String filePath = String.format("%s/%s/%s", companyName, folderType, fileName);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, metadata));
            String url = amazonS3.getUrl(bucket, filePath).toString();
            System.out.println("Uploaded file URL: " + url);
            return url;
        } catch (SdkClientException e) {
            System.out.println("Exception: " + e.getMessage());
            throw new BadRequestException(ExceptionCode.FAIL_TO_UPLOAD_IMAGE);
        }
    }

    public String uploadQRCode(byte[] qrCode, Long companyId) throws IOException {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        String companyName = company.getName();
        String fileName = UUID.randomUUID().toString() + "_qr_code.png";
        String filePath = String.format("%s/QR/%s", companyName, fileName);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/png");
        metadata.setContentLength(qrCode.length);

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(qrCode)) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, metadata));
            return amazonS3.getUrl(bucket, filePath).toString();
        } catch (AmazonServiceException e) {
            throw e;
        }
    }

    public void deleteFile(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(bucket, fileName);
    }
}
