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
            String msg = "Hello "+ user.getUserName()+",\n" +
                    "\n" +
                    "Your Email id : "+ user.getEmail()+"\n"+
                    "Your OTP code is : "+otp+" \n" +
                    "This code is valid for the next 10 minutes.\n" +
                    "\n" +
                    "Please do not share this code with anyone for your security.\n" +
                    "\n" +
                    "Thank you,\n" +
                    "Team BlogHive App";
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message,true);
            mimeMessageHelper.setFrom(fromEmail);
            mimeMessageHelper.setTo(user.getEmail());
            mimeMessageHelper.setSubject("Otp Verification");
            mimeMessageHelper.setText(msg);
            javaMailSender.send(message);
        }
        catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

}
