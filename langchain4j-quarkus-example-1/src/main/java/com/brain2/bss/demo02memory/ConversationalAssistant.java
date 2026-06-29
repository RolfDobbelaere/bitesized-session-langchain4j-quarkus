package com.brain2.bss.demo02memory;

import com.brain2.bss.common.NoRagAugmentorSupplier;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Chat-memory demo (no RAG). Each call carries a {@code sessionId} via {@link MemoryId}.
 *
 * quarkus-langchain4j enables an in-memory sliding-window chat memory automatically — you
 * do NOT need a ChatMemoryProvider bean. The catch is CDI scope: a {@code @RegisterAiService}
 * is {@code @RequestScoped} by default, and when that bean is destroyed at the end of each
 * HTTP request the framework wipes the bean's memory ids from the store — so history never
 * survives to the next call (the request logs showed exactly this: every prompt had only the
 * system + current message). Marking the service {@code @ApplicationScoped} keeps the memory
 * alive across requests, keyed by {@code sessionId}: same id shares history, a new id starts
 * fresh. The no-op {@link NoRagAugmentorSupplier} keeps easy-rag from quietly turning this
 * into a RAG call.
 */
@ApplicationScoped
@RegisterAiService(retrievalAugmentor = NoRagAugmentorSupplier.class)
public interface ConversationalAssistant {

    @SystemMessage("""
        You are a concise, friendly assistant.
        Within a conversation, remember what the user has told you and use it in later answers.
        Keep replies to one or two sentences.
        """)
    String chat(@MemoryId String sessionId, @UserMessage String message);
}
