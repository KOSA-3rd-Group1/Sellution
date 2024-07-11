package shop.sellution.server.global.annotation.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = BusinessRegistrationNumberValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidBusinessRegistrationNumber {
    String message() default "유효하지 않은 사업자 등록 번호 형식입니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
