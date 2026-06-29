package com.brain2.bss.demo03games;

import com.brain2.bss.common.NoRagAugmentorSupplier;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

/**
 * Structured-output demo (no RAG). The method returns a Java record, so the LLM is
 * asked to answer as JSON matching {@link GameChart}; quarkus-langchain4j injects the
 * schema and deserializes the response into the POJO automatically. No manual JSON
 * parsing anywhere.
 */
@RegisterAiService(retrievalAugmentor = NoRagAugmentorSupplier.class)
public interface GameExpert {

    @SystemMessage("You are a video game expert. Judge quality by Metacritic critic scores (0–100).")
    @UserMessage("""
        List the {count} best {genre} video games of all time, ranked by Metacritic score.
        For each game give its name, its publisher, its Metacritic score, and its release year.
        """)
    GameChart bestGames(int count, String genre);
}
