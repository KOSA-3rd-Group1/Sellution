package shop.sellution.server.global.annotation.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class BusinessRegistrationNumberValidator implements ConstraintValidator<ValidBusinessRegistrationNumber, String> {
    private static final Pattern PATTERN = Pattern.compile("^([1-9]\\d{2})-([0-9]{2})-([0-9]{5})$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        if (!PATTERN.matcher(value).matches()) {
            return false;
        }
        String[] parts = value.split("-");
        int firstPart = Integer.parseInt(parts[0]);
        int secondPart = Integer.parseInt(parts[1]);
        int thirdPart = Integer.parseInt(parts[2]);
        return firstPart >= 100 && firstPart <= 999 && secondPart >= 1 && secondPart <= 99 && thirdPart >= 1 && thirdPart <= 99999;
    }
}
