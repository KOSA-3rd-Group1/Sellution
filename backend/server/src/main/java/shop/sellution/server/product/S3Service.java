package shop.sellution.server.product;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
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
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class S3Service {
    private final AmazonS3 amazonS3;
    private final CompanyRepository companyRepository;

    @Value("${cloud.front.domain.name}")
    private String CLOUD_FRONT_DOMAIN_NAME;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Autowired
    public S3Service(AmazonS3 amazonS3, CompanyRepository companyRepository) {
        this.amazonS3 = amazonS3;
        this.companyRepository = companyRepository;
    }
    @MeasureExecutionTime
    public String uploadFile(MultipartFile file, Long companyId, String folderType, Enum<?> imageType) throws IOException {
        System.out.println("Uploading file: " + file.getOriginalFilename());
        System.out.println("Company ID: " + companyId);
        System.out.println("Folder type: " + folderType);
        System.out.println("Image type: " + imageType);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));

        String companyName = company.getName();
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        //String fileFormatName = file.getContentType().substring(file.getContentType().lastIndexOf("/") + 1);
        String fileFormatName = "jpg";
        String filePath = String.format("%s/%s/%s", companyName, folderType, fileName);

        MultipartFile resizedFile;
        if (folderType.equals("product")) {
            resizedFile = resizeProductImage(fileName, fileFormatName, file, (ProductImageType) imageType);
        } else if (folderType.equals("setting")) {
            resizedFile = resizeCompanyImage(fileName, fileFormatName, file, (ImagePurposeType) imageType);
        } else {
            resizedFile = file;
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(resizedFile.getContentType());
        metadata.setContentLength(resizedFile.getSize());

        try (InputStream inputStream = resizedFile.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, metadata));
//            String url = amazonS3.getUrl(bucket, filePath).toString();
            String url = CLOUD_FRONT_DOMAIN_NAME + "/" + filePath;
            System.out.println("Uploaded file URL: " + url);
            return url;
        } catch (AmazonServiceException e) {
            System.out.println("AmazonServiceException: " + e.getMessage());
            throw new BadRequestException(ExceptionCode.FAIL_TO_UPLOAD_IMAGE);
        } catch (SdkClientException e) {
            System.out.println("SdkClientException: " + e.getMessage());
            throw new BadRequestException(ExceptionCode.FAIL_TO_UPLOAD_IMAGE);
        }
    }

    private MultipartFile resizeProductImage(String fileName, String fileFormatName, MultipartFile originalImage, ProductImageType imageType) throws IOException {
        return resizeImage(fileName, fileFormatName, originalImage, 500, 500);
    }

    private MultipartFile resizeCompanyImage(String fileName, String fileFormatName, MultipartFile originalImage, ImagePurposeType imageType) throws IOException {
        switch (imageType) {
            case LOGO:
                return resizeImage(fileName, fileFormatName, originalImage, 300, 100);
            case PROMOTION:
                return resizeImage(fileName, fileFormatName, originalImage, 500, 500);
            default:
                return originalImage;
        }
    }

    public MultipartFile resizeImage(String fileName, String fileFormatName, MultipartFile originalImage, int targetWidth, int targetHeight) throws IOException {
        System.out.println("Resizing image: " + fileName);
        System.out.println("Original content type: " + originalImage.getContentType());
        System.out.println("Original size: " + originalImage.getSize());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(originalImage.getInputStream())
                .size(targetWidth, targetHeight)
                .outputFormat(fileFormatName)
                .toOutputStream(baos);

        MultipartFile resizedFile = new MockMultipartFile(fileName, fileName, "image/jpeg", new ByteArrayInputStream(baos.toByteArray()));
        System.out.println("Resized image size: " + resizedFile.getSize());

        return resizedFile;
    }


//    public MultipartFile resizeImage(String fileName, String fileFormatName, MultipartFile originalImage, int targetWidth, int targetHeight) throws IOException {
//        System.out.println("Resizing image: " + fileName);
//        System.out.println("Original content type: " + originalImage.getContentType());
//        System.out.println("Original size: " + originalImage.getSize());
//
//        BufferedImage bufferedImage;
//        try {
//            bufferedImage = ImageIO.read(originalImage.getInputStream());
//            if (bufferedImage == null) {
//                System.out.println("Failed to read image: " + fileName);
//                throw new BadRequestException(ExceptionCode.INVALID_IMAGE);
//            }
//        } catch (IOException e) {
//            System.out.println("IOException while reading image: " + e.getMessage());
//            throw new BadRequestException(ExceptionCode.INVALID_IMAGE);
//        }
//
//
//
//        System.out.println("Original dimensions: " + bufferedImage.getWidth() + "x" + bufferedImage.getHeight());
//
//        MarvinImage imageMarvin = new MarvinImage(bufferedImage);
//
//        int originWidth = bufferedImage.getWidth();
//        int originHeight = bufferedImage.getHeight();
//
//        if (originWidth <= targetWidth && originHeight <= targetHeight) {
//            System.out.println("Image is already smaller than or equal to target size, not resizing");
//            return originalImage;
//        }
//
//        try {
//            Scale scale = new Scale();
//            scale.load();
//            scale.setAttribute("newWidth", targetWidth);
//            scale.setAttribute("newHeight", targetHeight);
//            scale.process(imageMarvin.clone(), imageMarvin, null, null, false);
//        } catch (NullPointerException e) {
//            System.out.println("NullPointerException in Marvin Scale: " + e.getMessage());
//            e.printStackTrace();
//            throw new BadRequestException(ExceptionCode.FAIL_TO_RESIZE_IMAGE);
//        }
//
//        BufferedImage resizedImage = imageMarvin.getBufferedImageNoAlpha();
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        try {
//            ImageIO.write(resizedImage, "png", baos);
//            baos.flush();
//        } catch (IOException e) {
//            System.out.println("IOException while writing resized image: " + e.getMessage());
//            throw new BadRequestException(ExceptionCode.FAIL_TO_RESIZE_IMAGE);
//        }
//
//        MultipartFile resizedFile = new MockMultipartFile(fileName, fileName, "image/png", new ByteArrayInputStream(baos.toByteArray()));
//        System.out.println("Resized image size: " + resizedFile.getSize());
//
//        return resizedFile;
//    }

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
//            return amazonS3.getUrl(bucket, filePath).toString();
            return CLOUD_FRONT_DOMAIN_NAME + "/" + filePath;

        } catch (AmazonServiceException e) {
            throw e;
        }
    }

    public void deleteFile(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(bucket, fileName);
    }
}