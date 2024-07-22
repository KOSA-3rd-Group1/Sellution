package shop.sellution.server.global.annotation.validation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;


@Documented
@Constraint(validatedBy = BankCodeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidBankCode {
    String message() default "유효하지 않은 은행 코드입니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}