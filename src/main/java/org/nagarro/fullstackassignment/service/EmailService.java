package org.nagarro.fullstackassignment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.from:${spring.mail.username:}}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendPasswordResetOtp(String toEmail, String username, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromEmail != null && !fromEmail.isBlank()) {
            message.setFrom(fromEmail);
        }
        message.setTo(toEmail);
        message.setSubject("JustEat Password Reset OTP");
        message.setText(buildOtpBody(username, otp));
        mailSender.send(message);
    }

    private String buildOtpBody(String username, String otp) {
        return "Hi " + username + ",\n\n"
                + "Use this OTP to reset your JustEat account password:\n\n"
                + otp + "\n\n"
                + "This OTP is valid for a limited time and can be used only once.\n"
                + "If you did not request this reset, you can safely ignore this email.\n\n"
                + "Regards,\n"
                + "JustEat Team";
    }
}

