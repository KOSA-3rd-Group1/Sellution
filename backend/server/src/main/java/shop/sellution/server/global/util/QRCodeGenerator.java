//package shop.sellution.server.global.util;
//
//import com.google.zxing.BarcodeFormat;
//import com.google.zxing.EncodeHintType;
//import com.google.zxing.common.BitMatrix;
//import com.google.zxing.qrcode.QRCodeWriter;
//import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
//
//import javax.imageio.ImageIO;
//import java.awt.Color;
//import java.awt.Graphics2D;
//import java.awt.image.BufferedImage;
//import java.io.ByteArrayOutputStream;
//import java.util.HashMap;
//import java.util.Map;
//
//public class QRCodeGenerator {
//
//    public static byte[] generateQRCodeImage(String text, int width, int height) throws Exception {
//        QRCodeWriter qrCodeWriter = new QRCodeWriter();
//        //QR 코드 생성 시 사용할 힌트를 설정
//        Map<EncodeHintType, ErrorCorrectionLevel> hints = new HashMap<>();
//        //에러 수정 레벨을 L로 설정하여 QR 코드의 일부가 손상되어도 데이터를 복원할 수 있음
//        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
//
//        //주어진 텍스트를 QR 코드로 인코딩하여 BitMatrix 객체를 생성
//        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
//
//        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
//        bufferedImage.createGraphics();
//
//        Graphics2D graphics = (Graphics2D) bufferedImage.getGraphics();
//        //배경 색 설정
//        graphics.setColor(Color.WHITE);
//        graphics.fillRect(0, 0, width, height);
//        graphics.setColor(Color.BLACK);
//
//        for (int x = 0; x < width; x++) {
//            for (int y = 0; y < height; y++) {
//                if (bitMatrix.get(x, y)) {
//                    graphics.fillRect(x, y, 1, 1);
//                }
//            }
//        }
//
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//        //NG 형식으로 변환하여 바이트 배열로 반환
//        ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
//        return byteArrayOutputStream.toByteArray();
//    }
//}
//
//
