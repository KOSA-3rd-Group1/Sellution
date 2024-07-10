package shop.sellution.server.global.annotation.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class IdValidator implements ConstraintValidator<ValidId, String> {
    private static final Pattern PATTERN = Pattern.compile("^[a-zA-Z][a-zA-Z0-9]{5,19}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && PATTERN.matcher(value).matches();
    }
}
