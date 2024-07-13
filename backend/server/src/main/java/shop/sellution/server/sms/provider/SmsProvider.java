package shop.sellution.server.sms.provider;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SmsProvider {

    private final DefaultMessageService messageService;
    @Value("${cool.sms.from-number}") String FROM;

    public SmsProvider(
            @Value("${cool.sms.api-key}") String API_KEY,
            @Value("${cool.sms.api-secret-key}") String API_SECRET_KEY,
            @Value("${cool.sms.domain}") String DOMAIN
    ) {
        this.messageService = NurigoApp.INSTANCE.initialize(API_KEY, API_SECRET_KEY, DOMAIN);
    }

    public boolean sendSms(String to, String sendMessageText ) {
        Message message = new Message();
        message.setFrom(FROM);
        message.setTo(to);
        message.setText(sendMessageText);

        SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
        String statusCode = response.getStatusCode();
        boolean result = statusCode.equals("2000");

        return result;
    }
}
