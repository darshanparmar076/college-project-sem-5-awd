package com.bloghive.backend.utils;

import com.bloghive.backend.model.user.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private JavaMailSender javaMailSender;

    public void otpSenderMail(User user, String otp){
        try {
            System.out.println(otp);
            String msg = "Hello " + user.getUserName() + ",\n\n" +
                    "We received a request to verify your email address for BlogHive.\n\n" +
                    "To proceed, please use the OTP code below:\n\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "    Your OTP Code: " + otp + "\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                    "⏰ This code will expire in 5 minutes.\n\n" +
                    "📧 Email: " + user.getEmail() + "\n\n" +
                    "🔒 Security Tips:\n" +
                    "• Do not share this code with anyone\n" +
                    "• BlogHive will never ask for your OTP via phone or email\n" +
                    "• If you didn't request this code, please ignore this email\n\n" +
                    "Need help? Contact us at support@bloghive.com\n\n" +
                    "Best regards,\n" +
                    "The BlogHive Team\n\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "© 2025 BlogHive. All rights reserved.";
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message,true);
            mimeMessageHelper.setFrom(fromEmail);
            mimeMessageHelper.setTo(user.getEmail());
            mimeMessageHelper.setSubject("OTP Verification - BlogHive");
            mimeMessageHelper.setText(msg);
            javaMailSender.send(message);
        }
        catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

}
