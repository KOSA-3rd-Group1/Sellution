package shop.sellution.server.company.application;

import org.springframework.stereotype.Service;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.company.domain.repository.CompanyImageRepository;
import shop.sellution.server.company.domain.repository.CompanyRepository;
import shop.sellution.server.company.dto.FindCompanyUrlSettingRes;
import shop.sellution.server.company.dto.SaveCompanyUrlSettingReq;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;
import shop.sellution.server.global.util.QRCodeGenerator;


@Service
public class CompanyUrlSettingServiceImpl implements CompanyUrlSettingService {
    private final CompanyRepository companyRepository;


    public CompanyUrlSettingServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public FindCompanyUrlSettingRes getCompanyUrlSetting(Long companyId){
        Company company = companyRepository.findById(companyId).orElseThrow(() ->new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        if (company.getQrCode() == null) {
            try {
                byte[] qrCode = QRCodeGenerator.generateQRCodeImage(company.getShopUrl(), 200, 200);
                company.setQrCode(qrCode);
                companyRepository.save(company);
            } catch (Exception e) {
                // QR 코드 생성 실패 시 로깅하고 계속 진행
                //log.error("Failed to generate QR code for company: " + companyId, e);
            }
        }

        return FindCompanyUrlSettingRes.fromEntity(company);
    }

    @Override
    public void updateCompanyUrlSetting(SaveCompanyUrlSettingReq saveCompanyUrlSettingReq){
        Company company = companyRepository.findById(saveCompanyUrlSettingReq.getCompanyId()).orElseThrow(() -> new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY));
        company = saveCompanyUrlSettingReq.toEntity(company);

        try {
            byte[] qrCode = QRCodeGenerator.generateQRCodeImage(company.getShopUrl(), 200, 200);
            company.setQrCode(qrCode);
            // QR 코드를 파일로 저장
            //QRCodeFileUtil.saveQRCodeToFile(qrCode, "qr_code_" + company.getCompanyId() + ".png");
        } catch (Exception e) {
            throw new RuntimeException("QR Code generation failed", e);
        }
        companyRepository.save(company);


    }

}




