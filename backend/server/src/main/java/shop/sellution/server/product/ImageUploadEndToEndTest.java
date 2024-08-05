package shop.sellution.server.product;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.UUID;

public class ImageUploadEndToEndTest {
//    private static final String BUCKET_NAME = System.getenv("CLOUD_AWS_S3_BUCKET");
//    private static final String CLOUD_FRONT_DOMAIN = System.getenv("CLOUD_FRONT_DOMAIN_NAME");
    private static final String BUCKET_NAME = "t1-back-s3";
    private static final String CLOUD_FRONT_DOMAIN = "https://dn4dz12f3344k.cloudfront.net";
    private static final String AWS_REGION = "ap-northeast-2"; // 환경 변수로부터 AWS 지역을 읽어옴
    private static final int TARGET_WIDTH = 300;
    private static final int TARGET_HEIGHT = 300;

    private static AmazonS3 s3Client;

    public static void main(String[] args) {
        try {
            // AWS S3 클라이언트 초기화 시 지역 설정 추가
            s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(AWS_REGION)
                    .build();

            String originalImagePath = "/Users/jaeah/Desktop/hyosungedu/finalproject/jjae/Sellution/backend/server/src/main/java/shop/sellution/server/product/imagefile1.jpeg";
            File originalImageFile = new File(originalImagePath);
            System.out.println("라이브러리 :  Graphics2D" + "  이미지 포맷 형식 : jpg");
            // 1. 이미지 리사이징
            long resizeStart = System.currentTimeMillis();
            byte[] resizedImageBytes = resizeImage(originalImageFile);
            long resizeEnd = System.currentTimeMillis();
            System.out.println("리사이징 시간: " + (resizeEnd - resizeStart) + "ms");

            // 2. S3 업로드
            long uploadStart = System.currentTimeMillis();
            String imageUrl = uploadToS3(resizedImageBytes);
            long uploadEnd = System.currentTimeMillis();
            System.out.println("S3 업로드 시간: " + (uploadEnd - uploadStart) + "ms");

            // 3. CloudFront를 통한 다운로드
            long downloadStart = System.currentTimeMillis();
            byte[] downloadedImageBytes = downloadFromCloudFront(imageUrl);
            long downloadEnd = System.currentTimeMillis();
            System.out.println("다운로드 시간: " + (downloadEnd - downloadStart) + "ms");

            // 4. 이미지 렌더링 (로컬에서 시뮬레이션)
            long renderStart = System.currentTimeMillis();
            BufferedImage renderedImage = ImageIO.read(new ByteArrayInputStream(downloadedImageBytes));
            long renderEnd = System.currentTimeMillis();
            System.out.println("렌더링 시간: " + (renderEnd - renderStart) + "ms");

            // 전체 프로세스 시간 계산
            long totalTime = renderEnd - resizeStart;
            System.out.println("전체 프로세스 시간: " + totalTime + "ms");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static byte[] resizeImage(File imageFile) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Graphics2D.of(imageFile)
                .size(TARGET_WIDTH, TARGET_HEIGHT)
                .outputFormat("JPEG")
                .toOutputStream(outputStream);
        return outputStream.toByteArray();
    }

    private static String uploadToS3(byte[] imageBytes) {
        String fileName = UUID.randomUUID().toString().replace("-", "") + ".jpg";
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(imageBytes.length);
        metadata.setContentType("image/jpg");

        PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, fileName, new ByteArrayInputStream(imageBytes), metadata);
        s3Client.putObject(putObjectRequest);

        return CLOUD_FRONT_DOMAIN + "/" + fileName;
    }

    private static byte[] downloadFromCloudFront(String imageUrl) throws IOException {
        try (CloseableHttpClient httpClient = HttpClientBuilder.create().build()) {
            HttpGet request = new HttpGet(imageUrl);
            HttpResponse response = httpClient.execute(request);
            return response.getEntity().getContent().readAllBytes();
        }
    }
}
