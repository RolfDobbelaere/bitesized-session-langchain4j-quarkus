package com.brain2.bss.demo04tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import dev.langchain4j.agent.tool.Tool;
import io.quarkus.logging.Log;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;

/**
 * The actions the LLM can take in the @Tool demo (demo04tools). Each {@link Tool}-annotated
 * method is exposed to the model as a callable function — quarkus-langchain4j generates the
 * JSON schema from the signature and the description. The model reads the incoming message,
 * decides whether it is suspicious, and calls exactly one of these. We never parse intent in
 * Java; the model chooses the tool.
 */
@ApplicationScoped
public class MailTools {

    @Inject
    Mailer mailer;

    @Tool("Record an incoming message as safe / not suspicious. Use this when the message is harmless.")
    public String logClean(String sender, String subject) {
        Log.infof("Seems Clean! (from=%s, subject=\"%s\")", sender, subject);
        return "Logged as clean.";
    }

    @Tool("Forward a suspicious message to the company security team. Use this when the message looks like phishing, fraud, a credential or payment request, or otherwise risky for the company.")
    public String forwardToSecurity(String sender, String subject, String message, String reason) {
        mailer.send(Mail.withText(
                "security@brain2.com",
                "[SUSPICIOUS] " + subject,
                """
                        A message was flagged for review.

                        Reason: %s
                        From:   %s
                        Subject: %s

                        --- original message ---
                        %s
                        """.formatted(reason, sender, subject, message)));
        Log.warnf("Forwarded suspicious message to security@brain2.com (from=%s, reason=%s)", sender, reason);
        return "Forwarded to security@brain2.com.";
    }
}
