package com.brain2.ragdemo;

import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(retrievalAugmentor = TransformedRagAugmentorSupplier.class)
public interface TransformedRagAiService {

    String chat(String question);
}
