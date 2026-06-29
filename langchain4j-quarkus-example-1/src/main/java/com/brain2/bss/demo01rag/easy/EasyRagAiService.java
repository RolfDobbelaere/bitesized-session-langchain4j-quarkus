package com.brain2.bss.demo01rag.easy;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService
public interface EasyRagAiService {

    @SystemMessage("You are 'EasyRag' service, you're helpful and kind.")
    @UserMessage("Answer any question briefly, max 2 phrases. Reply to '{question}'.")
    String chat(String question);
}
