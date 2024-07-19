package shop.sellution.server.global.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class QRCodeFileUtil {
    public static void saveQRCodeToFile(byte[] qrCodeData, String filePath) throws IOException {
        //File file = new File(filePath);
        //file.getParentFile().mkdirs(); //필요한 디렉토리 생성
        try (FileOutputStream fos = new FileOutputStream(new File(filePath))) {
            fos.write(qrCodeData);
        }
    }
}
