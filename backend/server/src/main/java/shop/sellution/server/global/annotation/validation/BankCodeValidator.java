package shop.sellution.server.global.annotation.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import shop.sellution.server.account.domain.type.BankCode;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class BankCodeValidator implements ConstraintValidator<ValidBankCode, String> {

    private static final Set<String> VALID_BANK_CODES = Arrays.stream(BankCode.values())
            .map(BankCode::getBackCode)
            .collect(Collectors.toSet());

    @Override
    public boolean isValid(String bankCode, ConstraintValidatorContext context) {
        if (bankCode == null) {
            return true; // null values are handled by @NotNull annotation
        }
        return VALID_BANK_CODES.contains(bankCode);
    }
}
