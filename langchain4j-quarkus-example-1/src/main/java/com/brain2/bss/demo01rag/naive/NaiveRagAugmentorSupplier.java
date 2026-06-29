package com.brain2.bss.demo01rag.naive;

import com.brain2.bss.demo01rag.NewsletterStore;

import java.util.List;
import java.util.function.Supplier;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.injector.ContentInjector;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;

/**
 * "RAG by hand" — endpoint #2 of the demo. Everything a framework would otherwise hide
 * (retriever, augmentor, prompt injection) is spelled out here on purpose.
 */
@ApplicationScoped
public class NaiveRagAugmentorSupplier implements Supplier<RetrievalAugmentor> {

    @Inject
    NewsletterStore newsletterStore;

    @Inject
    EmbeddingModel embeddingModel;

    @Override
    public RetrievalAugmentor get() {
        var contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(newsletterStore.get())
                .embeddingModel(embeddingModel)
                .maxResults(3)
                .build();

        return DefaultRetrievalAugmentor.builder()
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
