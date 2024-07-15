package shop.sellution.server.global.annotation.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class AuthNumberValidator implements ConstraintValidator<ValidAuthNumber, String> {
    private static final Pattern PATTERN = Pattern.compile("^\\d{6}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && PATTERN.matcher(value).matches();
    }
}
