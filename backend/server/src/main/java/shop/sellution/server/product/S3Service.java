package shop.sellution.server.product;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import marvin.image.MarvinImage;
import marvin.plugin.MarvinImagePlugin;
import org.marvinproject.image.transform.scale.Scale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import static shop.sellution.server.product.domain.ProductImageType.*;

@Service
public class S3Service {
    //private static final Logger logger = LoggerFactory.getLogger(S3Service.class);


    private final AmazonS3 amazonS3;
    @Autowired
    private final CompanyRepository companyRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public S3Service(AmazonS3 amazonS3, CompanyRepository companyRepository) {
        this.amazonS3 = amazonS3;
        this.companyRepository = companyRepository;
    }

    public String uploadFile(MultipartFile file, Long companyId, String folderType) throws IOException {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        String companyName = company.getName(); // 회사 이름 가져오기
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String fileFormatName = file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
        String filePath = String.format("%s/%s/%s", companyName, folderType, fileName);


        MultipartFile resizedFile;
        switch (purpose) {
            case "logo":
                resizedFile = resizeImage(fileName, fileFormatName, file, 300, 100); // 3:1 ratio
                break;
            case "promotion":
                resizedFile = resizeImage(fileName, fileFormatName, file, 300, 300); // Square
                break;
            case "product":
                switch (getProductImageType(fileName)) {
                    case THUMBNAIL:
                        resizedFile = resizeImage(fileName, fileFormatName, file, 300, 300); // Square
                        break;
                    case LIST:
                        resizedFile = resizeImage(fileName, fileFormatName, file, 300, 300); // Square
                        break;
                    case DETAILS:
                        resizedFile = file; // No resizing for detail images
                        break;
                    default:
                        resizedFile = file;
                }
                break;
            default:
                resizedFile = file; // No resizing for other purposes
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try (InputStream inputStream = file.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, metadata));
            return amazonS3.getUrl(bucket, filePath).toString();
        } catch (AmazonServiceException e) {
            throw new BadRequestException(ExceptionCode.FAIL_TO_UPLOAD_IMAGE);
        }
    }

    public MultipartFile resizeImage(String fileName, String fileFormatName, MultipartFile originalImage, int targetWidth, int targetHeight) throws IOException {
        // MultipartFile -> BufferedImage Convert
        BufferedImage bufferedImage = ImageIO.read(originalImage.getInputStream());
        MarvinImage imageMarvin = new MarvinImage(bufferedImage);

        if (bufferedImage == null) {
            throw new BadRequestException(ExceptionCode.INVALID_IMAGE);
        }

        // newWidth : newHeight = originWidth : originHeight
        int originWidth = bufferedImage.getWidth();
        int originHeight = bufferedImage.getHeight();

        //origin 이미지가 resizing될 사이즈보다 작을 경우 resizing 작업 안 함
        if(originWidth < targetWidth)
            return originalImage;

        if(originHeight < targetHeight){
            return originalImage;
        }

        Scale scale = new Scale();
        scale.setAttribute("newWidth", targetWidth);
        scale.setAttribute("newHeight", targetHeight);
        scale.process(imageMarvin.clone(), imageMarvin, null, null, false);

        BufferedImage resizedImage = imageMarvin.getBufferedImageNoAlpha();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", baos);
        baos.flush();

        return new MockMultipartFile(originalImage.getName(), originalImage.getOriginalFilename(), originalImage.getContentType(), new ByteArrayInputStream(baos.toByteArray()));
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
