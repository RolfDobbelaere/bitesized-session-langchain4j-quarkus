package com.brain2.bss.demo04tools;

import com.brain2.bss.common.NoRagAugmentorSupplier;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

/**
 * Tool-calling demo (no RAG). Brain2's mail-security triage assistant: given an incoming
 * message it decides whether the message is suspicious and calls exactly one tool from
 * {@link MailTools} — {@code logClean} for harmless mail, {@code forwardToSecurity} for
 * risky mail. The decision is the model's; the tools just carry out the action.
 */
@RegisterAiService(tools = MailTools.class, retrievalAugmentor = NoRagAugmentorSupplier.class)
public interface MailGuardian {

    @SystemMessage("""
            You are Brain2's email security triage assistant.
            You are given a single incoming message: its sender, subject, and body.
            Decide whether it is suspicious for the company. Treat as suspicious anything that
            looks like phishing, a credential or password request, an unexpected payment or
            invoice change, malware or shady links, impersonation of staff or executives, or an
            attempt to exfiltrate company data.
            - If it is suspicious, call forwardToSecurity with a short one-line reason.
            - If it is harmless, call logClean.
            Call exactly one tool. Then reply with a single sentence stating your decision.
            """)
    @UserMessage("""
            From: {sender}
            Subject: {subject}
            Body:
            {message}
            """)
    String triage(String sender, String subject, String message);
}
