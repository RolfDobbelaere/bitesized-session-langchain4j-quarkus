package com.brain2.ragdemo;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

/**
 * Chat-memory demo (no RAG). Each call carries a {@code sessionId} via {@link MemoryId};
 * quarkus-langchain4j keeps a separate conversation window per id (default:
 * MessageWindowChatMemory, last 10 messages, in-memory). Two calls with the same
 * sessionId share history; a different sessionId starts fresh.
 */
@RegisterAiService(retrievalAugmentor = NoRagAugmentorSupplier.class)
public interface ConversationalAssistant {

    @SystemMessage("""
        You are a concise, friendly assistant.
        Within a conversation, remember what the user has told you and use it in later answers.
        Keep replies to one or two sentences.
        """)
    String chat(@MemoryId String sessionId, @UserMessage String message);
}
