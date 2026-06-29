package com.brain2.bss.demo01rag.naive;

import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService(retrievalAugmentor = NaiveRagAugmentorSupplier.class)
public interface NaiveRagAiService {

    String chat(String question);
}
