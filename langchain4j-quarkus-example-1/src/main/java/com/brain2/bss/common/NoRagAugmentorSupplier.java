package com.brain2.bss.common;

import java.util.List;
import java.util.function.Supplier;

import jakarta.enterprise.context.ApplicationScoped;

import dev.langchain4j.rag.AugmentationRequest;
import dev.langchain4j.rag.AugmentationResult;
import dev.langchain4j.rag.RetrievalAugmentor;

/**
 * A deliberately empty retrieval augmentor — it passes the user's message straight
 * through with no retrieval.
 *
 * Why this exists: the quarkus-langchain4j-easy-rag extension auto-binds its default
 * (RAG) augmentor to any @RegisterAiService that doesn't declare its own. The memory
 * and structured-output demos are meant to show those features in isolation, with NO
 * RAG, so they opt out by pointing at this no-op supplier.
 */
@ApplicationScoped
public class NoRagAugmentorSupplier implements Supplier<RetrievalAugmentor> {

    @Override
    public RetrievalAugmentor get() {
        return (AugmentationRequest request) ->
                AugmentationResult.builder()
                        .chatMessage(request.chatMessage())
                        .contents(List.of())
                        .build();
    }
}
