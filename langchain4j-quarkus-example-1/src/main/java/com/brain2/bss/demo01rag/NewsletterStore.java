package com.brain2.bss.demo01rag;

import static dev.langchain4j.data.document.splitter.DocumentSplitters.recursive;

import java.nio.file.Path;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.logging.Log;
import io.quarkus.runtime.StartupEvent;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

/**
 * Hand-wired ingestion shared by the naive and transformed RAG endpoints, kept separate
 * from the easy-rag extension's own (also in-memory) store so the demo can show both
 * approaches side by side without CDI bean ambiguity.
 */
@ApplicationScoped
public class NewsletterStore {

    private final EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();

    @Inject
    EmbeddingModel embeddingModel;

    @ConfigProperty(name = "rag.location")
    Path location;

    void ingest(@Observes StartupEvent ev) {
        List<Document> documents = FileSystemDocumentLoader.loadDocumentsRecursively(location, new ApachePdfBoxDocumentParser());
        EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
                .embeddingStore(store)
                .embeddingModel(embeddingModel)
                .documentSplitter(recursive(300, 30))
                .build();
        ingestor.ingest(documents);
        Log.infof("Ingested %d newsletter(s) into the naive/transformed in-memory store", documents.size());
    }

    public EmbeddingStore<TextSegment> get() {
        return store;
    }
}
