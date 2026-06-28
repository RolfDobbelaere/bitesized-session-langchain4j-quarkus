package com.brain2.ragdemo;

import io.quarkiverse.langchain4j.RegisterAiService;

/**
 * No {@code retrievalAugmentor} specified — picks up the default RetrievalAugmentor
 * that the quarkus-langchain4j-easy-rag extension wires automatically from
 * {@code quarkus.langchain4j.easy-rag.path}. This is endpoint #3 of the demo: same
 * answer as {@link NaiveRagAiService}, none of the manual wiring.
 */
@RegisterAiService
public interface EasyRagAiService {

    String chat(String question);
}
