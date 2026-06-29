package com.brain2.bss.demo01rag.transformed;

import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(retrievalAugmentor = TransformedRagAugmentorSupplier.class)
public interface TransformedRagAiService {

    String chat(String question);
}
