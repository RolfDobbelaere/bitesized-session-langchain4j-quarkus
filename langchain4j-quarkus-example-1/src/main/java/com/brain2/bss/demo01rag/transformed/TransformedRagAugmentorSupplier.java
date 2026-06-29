package com.brain2.bss.demo01rag.transformed;

import com.brain2.bss.demo01rag.NewsletterStore;

import java.util.List;
import java.util.function.Supplier;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.injector.ContentInjector;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.transformer.CompressingQueryTransformer;

/**
 * Same retriever as {@link com.brain2.bss.demo01rag.naive.NaiveRagAugmentorSupplier}, plus a query transformer —
 * endpoint #4 of the demo: the first knob to turn when naive RAG misses on a vague
 * or badly-phrased question.
 */
@ApplicationScoped
public class TransformedRagAugmentorSupplier implements Supplier<RetrievalAugmentor> {

    @Inject
    NewsletterStore newsletterStore;

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    ChatModel chatModel;

    @Override
    public RetrievalAugmentor get() {
        var contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(newsletterStore.get())
                .embeddingModel(embeddingModel)
                .maxResults(3)
                .build();

        return DefaultRetrievalAugmentor.builder()
                .queryTransformer(new CompressingQueryTransformer(chatModel))
                .contentRetriever(contentRetriever)
                .contentInjector(new ContentInjector() {
                    @Override
                    public ChatMessage inject(List<Content> contents, ChatMessage chatMessage) {
                        StringBuilder prompt = new StringBuilder(((UserMessage) chatMessage).singleText());
                        prompt.append("\n\nAnswer using only the following newsletter excerpts:\n");
                        contents.forEach(content -> prompt.append("- ").append(content.textSegment().text()).append("\n"));
                        return new UserMessage(prompt.toString());
                    }
                })
                .build();
    }
}
