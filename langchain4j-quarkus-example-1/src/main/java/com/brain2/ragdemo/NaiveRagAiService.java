package com.brain2.ragdemo;

import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(retrievalAugmentor = NaiveRagAugmentorSupplier.class)
public interface NaiveRagAiService {

    String chat(String question);
}
